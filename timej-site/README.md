# TIMEJ

TIMEJ by JARVIS is an Android timekeeping experience with a mechanical-inspired split-flap clock, stopwatch, countdown timer, Pomodoro workflow and visual theme definitions.

## Evidence-led APK inspection

The website's technical verification section is based on static inspection of the APK supplied for review.

- File size: 5,033,267 bytes (5.03 MB / 4.80 MiB).
- Manifest: versionName 2.2, versionCode 5, minSdkVersion 26, targetSdkVersion 34.
- The supplied manifest sets android:debuggable=true. This artifact is not cleared for public production distribution.
- SHA-256: 2971c15372b4e3e24e2f06585d3d0c2ded5a425829599af11adcf52f2aa82bf9.
- JAR/v1 signature verification reported success; the certificate is self-signed. APK v2/v3 validation with apksigner and independent signer identity verification were not performed.
- 60 FPS and below-45-MB RAM claims are unverified; no device benchmark or runtime memory capture was done.
- Android 8.0 is the declared minimum SDK. Android 15+ runtime compatibility has not been tested.
- No recognised ad SDK was found in static inspection; this does not establish the absence of runtime ad behaviour.
- Full offline operation is not confirmed: the APK declares INTERNET permission and uses remote asset references.
- Background-related code paths were found, but no native Service declaration was found and runtime persistence was not tested.

## Public release status

Do not attach the supplied debug-enabled APK to a public production release. Publish a new non-debuggable, release-signed build after validating version metadata, permissions, signing schemes and actual device behaviour. The public site links to the GitHub Releases page but keeps APK download paused until that validation is complete.

## Payments

UPI support is disabled by default. Configure only a guardian-managed payment account and payee name, with the account holder's supervision. Public UPI details are visible to visitors. The website does not verify transactions or unlock features automatically. No payment PIN, OTP, private token or account password belongs in this repository.

## Creator links

- Instagram: https://www.instagram.com/mokxith_jarvis/
- YouTube: https://www.youtube.com/@jarvis5104
- X: https://x.com/SinganaEce12668
- X: https://x.com/mokshithjarvis
- Portfolio: https://mokshith7777.github.io/jarvis-ai-portfolio/
- Projects: https://mokshith7777.github.io/projects/
- GitHub: https://github.com/mokshith7777
