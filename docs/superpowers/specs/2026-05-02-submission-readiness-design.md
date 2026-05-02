# Submission Readiness Design

## Goal

Projeyi yeni ekstra özellik eklemek yerine, mevcut çalışan çekirdeği kanıtlarıyla birlikte report öncesi teslim kapanışına hazır hale getirmek.

Not:

- final report assignment için zorunludur
- ancak kullanıcı isteği gereği report en sona bırakılacaktır
- bu fazın amacı, report hariç tüm teslim yüzeyini kanıtlarla hazır hale getirmektir

## Why This Is The Right Next Step

- Ödevin zorunlu kısmı canlı webcam -> FFmpeg -> DASH -> browser playback hattı.
- Bu hattın büyük kısmı çalışıyor, ancak teslim için gerekli kanıt, dokümantasyon ve compliance yüzeyi eksik.
- Ekstra kredi özellikleri puan artırabilir, ama eksik teslim paketi doğrudan daha büyük risk oluşturur.
- Audio ekstra kredi zaten çalışır durumda; bu teslimde ekstra özellik kanıtı olarak yeterli.

## Scope

Bu aşamanın hedefi yeni streaming özelliği eklemek değil, mevcut sistemi teslim için güvenli ve doğrulanmış hale getirmek.

Bu kapsamda yapılacaklar:

1. Gerçek demo akışını doğrulamak
2. Demo runbook'u tam ve doğru hale getirmek
3. Final assignment compliance checklist'ini kanıt bazlı güncellemek
4. Submission checklist ve SDK/open-source disclosure listesini hazırlamak
5. Report dışındaki teslim dokümanlarını tamamlamak
6. Final report için gerekli içerik ve disclosure hazırlığını önceden netleştirmek

Bu aşamada yapılmayacaklar:

- Adaptive DASH implementasyonu
- Motion detection implementasyonu
- Thumbnail seek preview implementasyonu
- Final report yazımı

## Recommended Approach

Teslime hazırlık işini 4 ayrı ama bağlı parçaya bölmek:

1. Real-system verification
2. Demo documentation alignment
3. Compliance and submission documentation
4. Final pre-report evidence capture preparation

Bu sıra şu yüzden doğru:

- önce gerçek sistem kanıtı toplanır
- sonra dokümanlar bu gerçeğe göre yazılır
- en son checklist ve submission yüzeyi kapatılır

## Architecture Of The Work

Bu iş yeni runtime mimarisi eklemez; mevcut mimarinin doğrulama ve teslim katmanını tamamlar.

Temel ilkeler:

- checklist maddeleri sadece gerçek kanıt varsa işaretlenecek
- demo dokümanları mevcut komut yüzeyiyle birebir uyumlu olacak
- `make demo-check` yalnızca preflight kontrol olarak kullanılacak; tek başına demo kanıtı sayılmayacak
- report en sona bırakılacak
- mevcut çalışan baseline ve audio akışları bozulmayacak
- `docs/project-checklist.md` teslim ilerlemesi için ana source of truth olacak; diğer dokümanlar onunla hizalanacak

## Work Areas

### 1. Real-System Verification

Gerçek makinede şu maddeler yeniden ve sistematik biçimde doğrulanacak:

- webcam detection
- local live playback
- seek control
- pause control
- go-live control
- screenshot output
- 2/4/6 second segment and latency evidence

Bu doğrulama, aşağıdaki operasyonel kanıtlarla desteklenecek:

- doğru cihazların `make list-devices` ile görüldüğü kayıt
- `make startup-all` veya `make startup-audio` ile kanonik launch akışının çalıştığı doğrulama
- browser'ın manifest istediği kanıt
- segment üretiminin sürdüğü kanıt
- seek, pause, go-live ve screenshot için gerçek adım adım manuel doğrulama
- screenshot dosyasının gerçekten üretildiği kanıt

Bu doğrulama tamamlanmadan compliance checklist işaretlenmeyecek.

### 2. Demo Runbook

`docs/demo-runbook.md` şu konuları eksiksiz içermeli:

- exact launch sequence
- hangi config'in nasıl hazırlanacağı
- hangi komutların hangi sırayla çalıştırılacağı
- online demo ve screen-share fallback
- iOS limitation
- Android/desktop recommendation
- audio modunun optional extra credit olduğu bilgisi

Kanonik demo komut yüzeyi `make` komutları üzerinden yazılacak. `tsx scripts/dev.ts` komutları alt düzey referans olabilir ama birincil runbook yolu olmayacak.

Kanonik launch sequence şu yapıda sabitlenecek:

1. `make validate-env`
2. `make list-devices`
3. local config kontrolü
4. `make demo-check` preflight
5. `make startup-all` veya gerekiyorsa `make startup-audio`
6. browser ile playback ve controls doğrulaması

Fallback planı da açık karar noktalarıyla yazılacak:

- remote URL erişimi başarısızsa screen-share fallback
- canlı akışta sorun varsa önceden hazırlanmış kanıt artefact'ları ile destekli gösterim

### 3. Compliance And Submission Docs

Şu yüzeyler kanıta göre güncellenecek:

- `docs/assignment-compliance.md`
- `docs/project-checklist.md`
- submission zip contents checklist
- SDK/open-source disclosure list

Bu bölümde temel amaç, repo içindeki tüm teslim-checklist yüzeylerini birbiriyle tutarlı hale getirmek.

Assignment PDF ile birebir hizalanacak minimum teslim maddeleri:

- FFmpeg ile capture ve encode
- encoded content'in server-side storage çıktısı
- HTTP üzerinden DASH live profile delivery
- HTML5 MSE + JavaScript only playback
- no plug-in usage
- H.264 video
- AAC if audio enabled
- 2/4/6 segment testleri ve latency
- no hardcoded system-specific parameters

Submission hazırlığı ayrıca şunları açıkça tanımlayacak:

- tek zip teslimi
- beklenen zip adı: `lastname(s)_project2.zip`
- zip içinde code, results, report ve ilgili artefact'ların bulunması

SDK/open-source disclosure bu fazda ayrı hazırlık listesi olarak tutulabilir, ama nihai olarak final report içine taşınacaktır.

### 4. Evidence Capture Preparation

Report yazılmayacak, ama report için gerekli kanıt toplama yüzeyi hazırlanacak:

- hangi screenshot'ların alınacağı netleştirilecek
- hangi komutla hangi ekranın açılacağı yazılacak
- hangi artefact'ların zip'e gireceği listelenecek
- hangi SDK/open-source bilgisinin report içine taşınacağı hazırlanacak

Bu, report aşamasını sonra hızlı bitirmeyi sağlayacak.

## Testing And Verification Strategy

Bu aşamadaki değişiklikler ikiye ayrılır:

1. Kod değişiklikleri gerekirse TDD ile yapılır
2. Doküman/checklist değişiklikleri gerçek verification çıktısına göre yapılır

Minimum kapanış kanıtı:

- `make lint`
- `make typecheck`
- `make test`
- `make build`
- `make e2e`

Ek olarak gerçek sistem kanıtı:

- `make demo-check` preflight sonucu
- live manifest request confirmation
- continuous segment generation confirmation
- required controls confirmation
- screenshot confirmation

`make demo-check` tek başına yeterli kanıt değildir; yalnızca ön kontrol olarak kullanılacaktır.

## Risks And Mitigations

### Risk: Dokümanlar gerçeği yansıtmayabilir

Mitigation:

- önce doğrulama, sonra doküman güncellemesi

### Risk: Checklist'ler birbirinden kopuk kalabilir

Mitigation:

- aynı oturumda `project-checklist`, `assignment-compliance`, `demo-runbook` birlikte hizalanacak

### Risk: Report en sona kalınca veri eksik olabilir

Mitigation:

- report yazmadan önce kanıt toplama yüzeyi ve artefact listesi hazırlanacak

### Risk: README mevcut proje seviyesini geride gösterebilir

Mitigation:

- README mevcut faz, komut yüzeyi ve doküman indeksine göre güncellenecek

## Success Criteria

Bu iş tamamlandığında:

- demo runbook gerçek çalışma akışını doğru anlatıyor olacak
- final assignment compliance checklist kanıtla güncellenmiş olacak
- screenshot ve demo gereksinimleri doğrulanmış olacak
- submission checklist ve SDK/open-source disclosure hazır olacak
- report hariç teslim yüzeyi tamamlanmış olacak
- final report fazına geçmek için gerekli kanıt ve artefact seti hazır olacak
