// Redirect only the Cloudflare Pages project hostname to the public domain.
// Requests to sidsdesign.de and www.sidsdesign.de continue normally.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'sids-design-racing.pages.dev') {
    url.protocol = 'https:';
    url.hostname = 'sidsdesign.de';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
