
// style="font-family:system-ui,&quot;Segoe UI&quot;,Roboto,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;;/* height:100vh; */text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;flex: 1;"

{/* <style>body{color:#000;background:#fff;margin:0}.next-error-h1{border - right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border - right:1px solid rgba(255,255,255,.3)}}</style> */ }

// H1: style="display:inline-block;margin:0 20px 0 0;padding:0 23px 0 0;font-size:24px;font-weight:500;vertical-align:top;line-height:49px"

// H2: style="font-size:14px;font-weight:400;line-height:49px;margin:0"

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center">
      <div className="flex gap-2 items-center">
        <h1 className="next-error-h1 text-2xl border-r px-2">404</h1>
        <div className="flex-inline">
          <h2 className="text-lg">This page could not be found.</h2>
        </div>
      </div>
    </main>
  )
}
