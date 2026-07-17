import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth.js";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
const IS_RECAPTCHA_DISABLED =
  import.meta.env.DEV && import.meta.env.VITE_DISABLE_RECAPTCHA === "true";

export default function AuthGate({ children }) {
  const { isAuthenticated, signIn } = useAuth();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const captchaRef = useRef(null);

  function resetCaptcha() {
    setCaptchaToken("");

    if (!IS_RECAPTCHA_DISABLED && window.grecaptcha && captchaRef.current !== null) {
      window.grecaptcha.reset(captchaRef.current);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!IS_RECAPTCHA_DISABLED && !captchaToken) {
        throw new Error("Captcha tekshiruvidan o'ting");
      }

      await signIn({
        login: loginValue,
        password,
        captchaToken: IS_RECAPTCHA_DISABLED ? undefined : captchaToken,
      });
    } catch (error) {
      setError(error.message);
      setPassword("");
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <div className="auth-logo">O</div>
        <div>
          <h1 className="auth-title">O'quv Markazi</h1>
          <p className="auth-subtitle">Tizimga kirish uchun login va parolni kiriting</p>
        </div>

        <label className="auth-field">
          <span>Login</span>
          <input
            autoFocus
            value={loginValue}
            type="text"
            autoComplete="username"
            onChange={(event) => {
              setLoginValue(event.target.value);
              setError("");
            }}
            disabled={isLoading}
          />
        </label>

        <label className="auth-field">
          <span>Parol</span>
          <input
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            disabled={isLoading}
          />
        </label>

        {!IS_RECAPTCHA_DISABLED ? (
          <RecaptchaBox
            siteKey={RECAPTCHA_SITE_KEY}
            disabled={isLoading}
            onVerify={(token) => {
              setCaptchaToken(token);
              setError("");
            }}
            onExpire={() => setCaptchaToken("")}
            widgetRef={captchaRef}
          />
        ) : null}

        {error ? <p className="auth-error">{error}</p> : null}

        <button className="btn btn-primary auth-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </form>
    </main>
  );
}

function RecaptchaBox({ siteKey, disabled, onVerify, onExpire, widgetRef }) {
  const containerRef = useRef(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!siteKey) {
      setLoadError("reCAPTCHA site key topilmadi");
      return undefined;
    }

    let isMounted = true;

    function renderWidget() {
      if (
        !isMounted ||
        !window.grecaptcha ||
        !containerRef.current ||
        widgetRef.current !== null
      ) {
        return;
      }

      widgetRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": () => {
          onExpire();
          setLoadError("reCAPTCHA tekshiruvi xato berdi");
        },
      });
    }

    if (window.grecaptcha) {
      window.grecaptcha.ready(renderWidget);
      return () => {
        isMounted = false;
      };
    }

    const existingScript = document.querySelector("script[data-recaptcha-script]");

    if (existingScript) {
      existingScript.addEventListener("load", renderWidget);
      return () => {
        isMounted = false;
        existingScript.removeEventListener("load", renderWidget);
      };
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.recaptchaScript = "true";
    script.addEventListener("load", renderWidget);
    script.addEventListener("error", () => {
      if (isMounted) {
        setLoadError("reCAPTCHA yuklanmadi");
      }
    });
    document.head.appendChild(script);

    return () => {
      isMounted = false;
      script.removeEventListener("load", renderWidget);
    };
  }, [onExpire, onVerify, siteKey, widgetRef]);

  return (
    <div className={`auth-captcha${disabled ? " is-disabled" : ""}`}>
      <div ref={containerRef} />
      {loadError ? <p className="auth-error">{loadError}</p> : null}
    </div>
  );
}
