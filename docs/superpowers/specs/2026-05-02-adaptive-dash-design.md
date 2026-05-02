# Adaptive DASH Design

## Goal

Mevcut tek bitrate DASH yayın hattını, aynı canlı kaynaktan birden fazla kalite temsili ureten ve `dash.js` tarafında adaptive oynatmayı destekleyen bir yapıya genişletmek.

## Why This Is Next

- Audio ekstra kredi akışı artık çalışıyor ve doğrulandı.
- Ödev metnindeki en doğal ikinci ekstra özellik adaptive DASH.
- Motion detection ve thumbnail UI'ya göre mevcut FFmpeg + DASH + player mimarisine daha az yabancı.
- Teslime giderken "streaming" tarafındaki teknik derinliği artırır.

## Scope

Bu aşamada hedef en küçük ama gerçek adaptive DASH teslimi:

- aynı input kaynağından 3 temsil üretmek: low, medium, high
- tek bir multi-representation MPD üretmek
- mevcut player'ın bu manifesti oynatabilmesi
- `dash.js` adaptasyon davranışının local olarak doğrulanması
- config, test ve dokümantasyonun buna göre güncellenmesi

Bu aşamada kapsam dışı:

- custom bitrate selector UI
- manuel representation switching kontrolleri
- audio + adaptive kombinasyonunu aynı anda destekleme
- production-grade bitrate ladder tuning
- görsel ağ hızı simülasyon arayüzü

## Approach Options

### Option 1: Minimal ABR Builder

Mevcut baseline builder'a paralel yeni bir `buildAbrCommand.ts` eklenir. Bu builder tek FFmpeg komutuyla 3 video representation üretir ve tek MPD içinde yayınlar.

Artıları:

- mevcut mimariyle uyumlu
- baseline ve audio akışlarından ayrık kalır
- test etmesi kolay

Eksileri:

- audio ile birleşik mod daha sonra ayrıca düşünülmeli

### Option 2: Existing Builder'ı Genel Hale Getirmek

`buildBaselineCommand` çok modlu bir builder haline getirilir; baseline, audio ve abr tek yerden yönetilir.

Artıları:

- tek giriş noktası

Eksileri:

- şu anda çalışan baseline ve audio yollarını gereksiz yere risk altına sokar
- küçük iş için fazla refactor gerektirir

### Option 3: Separate Demo-Only ABR Script

Startup akışından bağımsız özel bir script ile sadece demo için multi-bitrate MPD üretilir.

Artıları:

- mevcut runtime'a minimum etki

Eksileri:

- ürün akışından kopuk kalır
- dokümantasyon ve demo yüzeyi ikiye bölünür

## Recommended Approach

Option 1.

Yeni bir `buildAbrCommand.ts` ve `configs/ffmpeg/abr.json` eklenir. Startup planı explicit bir `--abr` modu ile bu builder'ı seçer. Böylece:

- baseline video-only yol korunur
- audio yolu korunur
- ABR akışı açık bir mod olarak eklenir
- demo sırasında hangi akışın çalıştığı net olur

## Architecture

### Startup Surface

Yeni çalışma modu `--abr` olacak.

- default: baseline `live.mpd`
- `--audio`: audio-enabled `live-audio.mpd`
- `--abr`: adaptive `live-abr.mpd`

Bu aşamada `--audio --abr` kombinasyonu desteklenmeyecek. İki mod aynı anda verilirse startup açık bir hata ile duracak. Bunun nedeni scope'u kontrollü tutmak ve baseline ile audio doğrulanmış akışları bozma riskini azaltmak.

### FFmpeg Output Model

Tek input kaynağından 3 video temsil üretilecek:

- low: daha düşük çözünürlük ve bitrate
- medium: orta çözünürlük ve bitrate
- high: mevcut baseline'a yakın kalite

Başlangıç ladder önerisi:

- low: `426x240`, yaklaşık `400k`
- medium: `854x480`, yaklaşık `1000k`
- high: `1280x720`, yaklaşık `2500k`

Bu değerler demo için yeterince ayrışan, ama yerel makinede aşırı yük yaratmayan başlangıç noktalarıdır.

FFmpeg komutu:

- tek input alır
- `split` ve `scale` filter graph ile 3 çıkış üretir
- her çıkış için ayrı bitrate ayarlar
- DASH muxer ile tek MPD üretir

### Config Model

`configs/ffmpeg/abr.json` sadece dokümantasyon ve test referansı olarak tutulacak; mevcut `baseline.json` ve `audio.json` ile aynı seviyede olacak.

İlk sürümde app config içine detaylı ABR ladder taşımıyoruz. Bunun nedeni gereksiz config karmaşıklığını önlemek. Ladder değerleri builder içinde sabit ama açık isimli constant'lar olarak tutulabilir. Eğer teslim öncesi varyasyon ihtiyacı doğarsa sonraki adımda app config'e taşınır.

### Player Integration

Player tarafında yeni bir UI gerekmiyor.

Mevcut `?manifest=` mekanizması ABR için de kullanılacak. Startup summary ve player URL buna göre üretilecek.

`dash.js` tarafında doğrulamak istediğimiz şey:

- MPD çoklu representation içeriyor mu
- player manifesti yükleyebiliyor mu
- playback başlıyor mu
- en azından teknik olarak adaptation engine aktif bir multi-representation kaynağa bağlanıyor mu

Bu aşamada UI üzerinde "current quality" göstergesi eklemek gerekmiyor.

## Error Handling

- `--abr` ve `--audio` birlikte verilirse: açık startup hatası
- ABR startup'ta manifest adı `live-abr.mpd` dışında bir şeye kaymamalı
- builder eksik representation üretirse test kırılmalı
- manifest içinde beklenen representation sayısı yoksa integration doğrulaması kırılmalı

## Testing Strategy

TDD zorunlu olacak.

### Unit Tests

- `tests/unit/buildAbrCommand.test.ts`
- ABR komutunun:
  - 3 representation ürettiğini
  - `filter_complex` içerdiğini
  - beklenen çözünürlükleri kullandığını
  - `live-abr.mpd` çıktısına yazdığını
  - DASH muxer kullandığını

### Option Parsing / Startup Tests

- `tests/unit/devOptions.test.ts`
- `tests/unit/startupPlan.test.ts`
- `tests/unit/startupSummary.test.ts`

Doğrulanacaklar:

- `--abr` parse ediliyor mu
- `--audio` + `--abr` reddediliyor mu
- startup plan doğru player URL ve manifest URL üretiyor mu
- summary ABR modunu açıkça yazıyor mu

### Integration Tests

- `tests/integration/abr-manifest.test.ts`

Bu test gerçek FFmpeg çalıştırmak zorunda değil. İlk aşamada `createStartupPlan(..., { abr: true })` üzerinden oluşturulan komutun multi-representation akış için gerekli ana parçaları içerdiğini doğrulaması yeterli.

Gerçek manifest doğrulaması ise manual/local verification adımıyla desteklenecek.

## Manual Verification

Gerçek local doğrulamada şu kanıtlar toplanmalı:

1. `startup:abr` ile stack açılmalı
2. `http://127.0.0.1:<port>/dash/live-abr.mpd` erişilebilir olmalı
3. MPD içinde birden fazla representation bulunmalı
4. Browser player ABR manifesti ile açılmalı
5. Playback başlamalı

Mümkün olursa ağ/CPU koşulu değiştirildiğinde representation değişimi gözlemlenir; ama bu zorunlu kabul edilmeyecek. Bu aşamada multi-representation playback'in çalışması yeterli teslim kanıtıdır.

## Documentation Updates

Şu dosyalar güncellenecek:

- `README.md`
- `docs/project-checklist.md`
- `docs/assignment-compliance.md`
- gerekirse `docs/demo-runbook.md`

Checklist'te ABR maddeleri ancak gerçek kod + test + local doğrulama tamamlanınca işaretlenecek.

## Risks And Mitigations

### Risk: FFmpeg command complexity

Mitigation:

- builder ayrı dosyada tutulacak
- testler komut parçalarını açıkça doğrulayacak

### Risk: Mevcut çalışan modları bozmak

Mitigation:

- explicit `--abr` modu kullanılacak
- baseline ve audio modları aynen korunacak
- kombinasyonlar açıkça reddedilecek

### Risk: Yerel makinede ABR encode yükü yüksek olabilir

Mitigation:

- conservative ladder seçilecek
- first delivery'de 3 net ama makul profil kullanılacak

## Success Criteria

Bu iş tamamlandığında:

- `--abr` ile adaptive DASH stack başlatılabiliyor olacak
- `live-abr.mpd` çoklu representation içerecek
- player bu manifesti oynatabilecek
- unit/integration testleri eklenecek ve geçecek
- ilgili checklist ve docs güncellenecek
