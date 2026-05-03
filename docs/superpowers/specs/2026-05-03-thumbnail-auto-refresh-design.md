# Thumbnail Auto Refresh Design

## Goal

`make startup-all` calistiktan sonra thumbnail uretimi manuel komut gerektirmeden otomatik baslasin ve yayin surerken her 10 saniyede bir yenilensin.

## Why

- Mevcut davranis thumbnail uretimini tek sefere bagliyor.
- Canli DVR gecmisi ilerledikce thumbnail seti de ilerlemeli.
- Kullanici `make thumbnails-generate` calistirmak zorunda kalmamali.

## Chosen Approach

Thumbnail yenilemesini mevcut `startup-all` akisi icindeki ayni Node surecinde arka plan loop olarak calistirmak.

Bu yaklasim secildi cunku:

- en kucuk dogru degisiklik bu
- mevcut startup ve shutdown akisina kolay entegre olur
- ek process yonetimi gerektirmez

## Runtime Behavior

`startup-all` veya FFmpeg baslatan ilgili startup modu calistiginda:

1. FFmpeg baslar.
2. Sistem ilk thumbnail seti icin 60 saniye bekler.
3. Ilk uretim denenir.
4. Sonrasinda her 10 saniyede bir yeni thumbnail sprite ve metadata yeniden uretilir.
5. Player tarafi mevcut periyodik metadata refresh davranisiyla yeni metadata ve sprite URL surumlerini alir.

## Failure Handling

- Thumbnail uretimi bir turda basarisiz olursa mevcut thumbnail dosyalari korunur.
- Hata loglanir.
- Sistem sonraki 10 saniyelik turda tekrar dener.
- Thumbnail loop ana canli oynatma hattini durdurmaz.

## Shutdown Behavior

- Kullanici sureci kapattiginda thumbnail loop da durur.
- Yeni bir tur baslatilmaz.
- Kapanis sirasinda yarim kalmis bir loop varsa surec beklenmeden temiz kapanis tercih edilir.

## Files Likely To Change

- `scripts/dev.ts`
- gerekiyorsa loop davranisini testlemek icin ilgili unit test dosyalari

## Testing Strategy

Behavior degistigi icin TDD ile ilerlenir.

Eklenecek veya guncellenecek dogrulamalar:

- FFmpeg basladiktan sonra thumbnail yenileme loop'unun planlandigini dogrulayan unit test
- hata durumunda loop'un durmadigini dogrulayan unit test
- mevcut thumbnail service testleri
- repo capinda `make lint`, `make typecheck`, `make test`, `make build`, `make e2e`

## Non-Goals

- ayri thumbnail worker process'i eklemek
- browser'in thumbnail yenilemeyi server'a tetiklemesi
- ABR veya audio icin ayri thumbnail politikasi tasarlamak

## Success Criteria

- `make startup-all` sonrasi manuel thumbnail komutu gerekmemesi
- ilk thumbnail setinin otomatik uretilmesi
- yayin uzadikca thumbnail setinin her 10 saniyede bir ilerlemesi
- uretim hatasi olsa bile sonraki denemelerde sistemin devam etmesi
- player tarafinda yeni thumbnail'larin zamanla gorulebilmesi
