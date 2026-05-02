# Motion Detection Design

## Goal

Baseline canlı DASH akışı için server-side motion detection ve player içinde hafif bir motion notification göstergesi eklemek.

## Scope

Bu fazda yapılacaklar:

- sadece baseline `live.mpd` akışı için motion detection
- sidecar motion detection akışı
- basit frame-difference mantığı
- motion status JSON üretimi
- player içinde küçük motion notification
- unit test, integration test, browser test ve real local verification

Bu fazda yapılmayacaklar:

- ABR/audio akışları için motion detection
- ML/CV tabanlı gelişmiş detection
- websocket/push notification altyapısı
- server dışı remote notification

## Recommended Approach

Motion detection ana canlı capture zincirine gömülmeyecek. Ayrı bir sidecar, baseline DASH artefact'larından son video segmenti okuyacak, FFmpeg ile küçük grayscale frame çıkaracak ve bir önceki frame ile kıyaslayacak. Eşik aşılırsa motion status JSON güncellenecek. Player bu JSON'u periyodik olarak okuyup kısa bir bildirim gösterecek.

## Architecture

### Runtime Model

- baseline `startup-all` akışı korunur
- motion detection ayrı script/sidecar olarak çalışır
- baseline video chunk'larından örnek frame çıkarır
- motion sonucu `/dash/motion/status.json` benzeri statik bir yüzeye yazılır
- player bu yüzeyi read-only tüketir

### Detection Model

- FFmpeg ile küçük grayscale raw frame üret
- mevcut frame ile önceki frame arasındaki ortalama mutlak farkı hesapla
- fark `motion.threshold` değerini aşarsa motion detected say

İlk sürümde amaç yaklaşık güvenilir motion uyarısıdır; frame-perfect veya scene classification hedeflenmez.

### Player Integration

- player startup'ta motion status endpoint'ini periyodik poll eder
- motion algılanırsa küçük bir notification banner gösterir
- motion yoksa banner gizlenir
- motion sistemi bozulursa player ana playback davranışı etkilenmez

## Error Handling

- motion status dosyası yoksa UI sessizce gizli kalır
- motion sidecar frame çıkaramazsa mevcut playback bozulmaz
- bozuk JSON motion notification'ı devre dışı bırakır

## Testing Strategy

- unit: frame difference hesabı
- unit: motion threshold değerlendirmesi
- integration: motion service status üretimi
- e2e: motion notification görünmesi
- real local: canlı stack + motion sidecar + browser notification doğrulaması

## Success Criteria

- baseline akış için motion status üretilebiliyor olacak
- player motion notification gösterecek
- motion sistemi arızalansa bile playback bozulmayacak
- testler ve local verification tamamlanacak
