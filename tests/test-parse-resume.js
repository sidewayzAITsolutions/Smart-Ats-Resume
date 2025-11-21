// Simple integration test for /api/parse-resume
// Requires dev server running on localhost:3000 and a logged-in session cookie (if auth enforced).
// To run: first start dev server, ensure you have a valid session, then: npm run test:parse-resume

(async () => {
  const endpoint = 'http://localhost:3000/api/parse-resume';

  // Minimal PDF ("Hello World") base64 encoded
  const base64Pdf = `JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PnN0cmVhbQpCVCAvRjEgMjQgVGYgMTAwIDcwMCBUZCAoSGVsbG8gV29ybGQpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTE3IDAwMDAwIG4gCjAwMDAwMDAyNzQgMDAwMDAgbiAKMDAwMDAwMDM3MSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQ1MAolJUVPRg==`;

  try {
    const pdfBuffer = Buffer.from(base64Pdf, 'base64');
    const file = new File([pdfBuffer], 'sample.pdf', { type: 'application/pdf' });
    const form = new FormData();
    form.append('resume', file);

    console.log('Sending test PDF to /api/parse-resume...');
    const res = await fetch(endpoint, { method: 'POST', body: form, credentials: 'include' });
    const json = await res.json();

    console.log('Status:', res.status);
    console.log('Response JSON:', json);

    if (json.success && json.parsedText) {
      console.log('✅ Parse succeeded, extracted text length:', json.parsedText.length);
      if (!json.parsedText.toLowerCase().includes('hello')) {
        console.warn('⚠ Parsed text does not contain expected word "hello".');
      }
    } else {
      console.error('❌ Parse failed:', json.error || 'Unknown error');
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('❌ Test errored:', err);
    process.exitCode = 1;
  }
})();
