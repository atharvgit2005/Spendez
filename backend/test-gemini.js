const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI("AIzaSyBKNAvsp-6MEXj9WqcdOGJUldCqXQLRON8");

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch (e) {
    console.error("1.5-flash error:", e.message);
  }
}
run();
