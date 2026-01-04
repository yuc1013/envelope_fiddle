import { useEffect, useRef } from "preact/hooks"

const base = import.meta.env.BASE_URL;

function loadScript(src: string): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve(script)
    script.onerror = () => reject(new Error(`failed to load script ${src}`))
    document.body.appendChild(script)
  })
}

export default function Wallpaper() {
  const containerRef = useRef<HTMLDivElement>(null)
  const filePickerRef = useRef<HTMLInputElement>(null)
  const scriptsRef = useRef<HTMLScriptElement[]>([])

  useEffect(() => {
    let mounted = true;

      (async () => {
        try {
          const threeScript = await loadScript(`${base}js/three.min.js`);
          const guiScript   = await loadScript(`${base}js/dat.gui.min.js`);
          const customScript= await loadScript(`${base}js/script.js`);

          if (!mounted) return

          scriptsRef.current = [threeScript, guiScript, customScript]

          if (containerRef.current) {
            (window as any).container = containerRef.current
          }

          if (filePickerRef.current) {
            (window as any).filePicker = filePickerRef.current
          }
        } catch (err) {
          console.log('failed to load scripts', err)
        }
      })()

    return () => {
      mounted = false
      scriptsRef.current.forEach(s => s.parentNode?.removeChild(s))
      scriptsRef.current = []
    }
  }, [])

  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <div id="container" ref={containerRef}></div>
      <input type="file" id="filePicker" accept=".jpg,.jpeg,.png,.mp4,.webm" style={{ visibility: 'hidden' }} ref={filePickerRef} />
    </div>
  )
}