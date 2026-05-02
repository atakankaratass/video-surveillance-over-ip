# Thumbnail Seek Preview Design

## Goal

Canlı baseline DASH akışı için, seek bar üzerinde mouse hover sırasında kullanıcının yaklaşık geçmiş görüntüyü görebileceği bir thumbnail preview sistemi eklemek.

## Why This Scope

- Ödev PDF'de thumbnail preview zorunlu değil, `better UI feature` olarak ekstra kredi tarafında geçiyor.
- Ana teslim hattı `FFmpeg -> DASH -> NGINX -> HTML5/MSE player` olduğundan, thumbnail özelliği bu hattı bozmadan eklenmeli.
- Verilen tutorial/reference'lar `dash.js` playback ve DASH akışını anlatıyor; thumbnail için özel bir zorunlu yaklaşım vermiyor.
- Bu nedenle en güvenli çözüm, mevcut baseline akıştan ayrı çalışan bir sidecar thumbnail üretim yolu.

## Scope

Bu fazda yapılacaklar:

- sadece baseline `live.mpd` akışı için thumbnail preview
- sadece masaüstü mouse hover davranışı
- server-side thumbnail artefact üretimi
- sprite image + metadata JSON modeli
- player hover preview kutusu
- unit test + browser test + real local doğrulama

Bu fazda yapılmayacaklar:

- audio akışı için thumbnail preview
- ABR akışı için thumbnail preview
- mobile/touch thumbnail UX
- frame-perfect preview garantisi
- persistent historical archive preview
- thumbnail varsa seek'i değiştiren yeni davranışlar

## Approach Options

### Option 1: Thumbnail Sidecar from DASH Output

Thumbnail üretimi ana canlı pipeline'dan ayrı olur. Sidecar süreç, mevcut DASH video artefact'larından thumbnail üretir; ardından sprite ve metadata dosyalarını yazar.

Artıları:

- ana capture/playback hattına en az risk
- kullanıcıya servis edilen encoded görüntüyle daha tutarlı
- thumbnail tarafı bozulsa bile player ana işlevi kaybetmez

Eksileri:

- ekstra artefact üretim akışı gerekir

### Option 2: Thumbnail Sidecar from Raw Capture

Canlı capture kaynağı ayrıca thumbnail üretimi için de okunur.

Artıları:

- teorik olarak daha erken kare üretimi

Eksileri:

- capture tarafında daha fazla risk
- kullanıcıya oynatılan encoded görüntüden sapabilir
- sistem yükünü ve cihaz erişim karmaşıklığını artırır

### Option 3: Client-Side Thumbnail Extraction

Player, seek preview için browser tarafında mevcut video elementten anlık kare çıkarmaya çalışır.

Artıları:

- server tarafı daha az iş

Eksileri:

- live/DASH/time-shift penceresi için güvenilir değil
- geçmiş preview beklentisini doğru karşılamaz
- ekstra kredi için "daha tam" çözüm sayılmaz

## Recommended Approach

Option 1.

Thumbnail preview, baseline `live.mpd` akışı için ayrı bir sidecar üretim hattı ile yapılacak. Sprite ve metadata HTTP üzerinden servis edilecek; player bu veriyi hover sırasında kullanacak.

## Architecture

### Runtime Model

Ana `startup-all` akışı değişmeden korunur.

Thumbnail sistemi:

- ayrı çalıştırılabilir/opsiyonel bir üretim süreci olur
- baseline video artefact'larını kullanır
- sprite image ve metadata JSON üretir
- player bu dosyaları read-only biçimde tüketir

Bu yaklaşımda thumbnail sistemi ana playback zincirinin kritik parçası değildir. Thumbnail üretimi bozulursa player normal seek davranışına dönmeye devam eder.

### Artifact Model

İlk sürümde iki ana çıktı olacak:

- sprite image dosyası
- metadata JSON dosyası

Metadata her thumbnail için en az şu bilgileri taşımalı:

- preview zamanı
- sprite dosya adı veya versiyonu
- x konumu
- y konumu
- width
- height

İlk sürüm için preview zamanı mutlak frame eşleşmesi değil, seek preview hint mantığında olacak.

### Time Model

Canlı DASH akışı kayan bir DVR window kullandığı için thumbnail preview mutlak tarih/zaman eksenine değil, mevcut live window içindeki göreli seek zamanı mantığına göre çalışmalı.

İlk sürümde:

- sadece mevcut seekable/live window aralığı kadar preview tutulur
- preview, yaklaşık seek yardımcısı olarak sunulur
- frame-perfect garanti verilmez

### Player Integration

Player tarafında seek slider üzerine hover geldiğinde:

1. hover konumu seek yüzdesine çevrilir
2. mevcut live window içinde yaklaşık hedef zaman bulunur
3. metadata içinden bu zamana en yakın thumbnail kaydı seçilir
4. preview kutusu sprite içinden doğru crop alanını gösterir

Preview gösterilemezse:

- player hata fırlatmaz
- seek kontrolleri aynen çalışır
- preview sadece gizli kalır

### Serving Model

Thumbnail artefact'ları aynı local HTTP yüzeyi üzerinden servis edilecek.

İlk sürümde isimlendirme ve yazma davranışı güvenli olmalı:

- JSON ve sprite eşleşmesi korunmalı
- yarım yazılmış artefact okunmamalı
- mümkünse temp dosyaya yazıp sonra rename mantığı kullanılmalı

İlk sürümde tek bir güncel sprite + metadata çifti yeterli; ancak iç yapı daha sonra versiyonlu artefact modeline genişletilebilir olmalı.

## Error Handling

- thumbnail artefact'ları yoksa preview UI görünmez, player çalışmaya devam eder
- metadata bozuksa preview sessizce devre dışı kalır
- hover zamanı için uygun kayıt yoksa en yakın geçerli kayıt seçilir veya preview gizlenir
- thumbnail sidecar başarısız olsa bile `live.mpd` playback etkilenmez

## Testing Strategy

TDD zorunlu olacak.

### Unit Tests

- metadata oluşturma/okuma
- hover zamanı -> thumbnail kaydı eşleme
- player preview state helper mantığı

### Browser Test

- seek bölgesine hover yapılınca preview görünmesi
- metadata varsa preview içeriğinin güncellenmesi
- metadata yoksa player'ın bozulmaması

### Real Local Verification

Gerçek local doğrulama şunları kanıtlamalı:

1. baseline canlı stack çalışıyor
2. thumbnail artefact'ları üretiliyor
3. browser seek hover sırasında preview gösteriyor
4. seek/go-live ana davranışı bozulmuyor

## Documentation Updates

Şu yüzeyler güncellenecek:

- `README.md`
- `docs/project-checklist.md`
- gerekirse `docs/demo-runbook.md`

Checklist maddeleri ancak gerçek artefact üretimi ve browser preview doğrulandıktan sonra kapatılacak.

## Risks And Mitigations

### Risk: Main live pipeline bozulabilir

Mitigation:

- thumbnail üretimi sidecar olacak
- ana FFmpeg baseline komutuna gömülmeyecek

### Risk: Preview yanlış zaman gösterebilir

Mitigation:

- ilk sürümde frame-perfect iddia edilmeyecek
- preview mevcut live window içindeki yaklaşık seek hint olarak konumlanacak

### Risk: Browser test kırılgan olabilir

Mitigation:

- masaüstü hover akışıyla sınırlı kalınacak
- minimal ama görünür preview UI tercih edilecek

### Risk: Artefact senkronizasyonu bozulabilir

Mitigation:

- sprite ve metadata birlikte güncellenecek
- mümkün olduğunca atomik yazım yaklaşımı kullanılacak

## Success Criteria

Bu iş tamamlandığında:

- baseline canlı akış için thumbnail artefact'ları üretiliyor olacak
- player seek bar hover sırasında preview gösterecek
- preview başarısız olsa bile normal seek akışı bozulmayacak
- unit test ve browser test eklenecek
- gerçek local doğrulama yapılacak
