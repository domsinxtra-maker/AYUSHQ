const question = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const answer = document.getElementById("answer");
const copyBtn = document.getElementById("copyBtn");
const themeBtn = document.getElementById("themeBtn");

function setQuestion(text) {
  question.value = text;
  question.focus();
}

askBtn.addEventListener("click", async () => {

  const q = question.value.trim();

  if (!q) {
    answer.textContent = "Please type a question first.";
    return;
  }

  answer.textContent = "AYUSHQ is thinking... 🤔";
  askBtn.disabled = true;

  try {

    const response = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: q
      })
    });

    const data = await response.json();

    if (data.answer) {
      answer.textContent = data.answer;
    } else {
      answer.textContent =
        "Sorry, I couldn't get an answer right now.";
    }

  } catch (error) {

    answer.textContent =
      "Server se connection nahi ho pa raha. Backend check karo.";

  }

  askBtn.disabled = false;
});

copyBtn.addEventListener("click", async () => {

  const text = answer.textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = "Copy";
    }, 1500);
  } catch {
    alert("Copy nahi ho paya.");
  }

});

themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeBtn.textContent = "🌙";
  } else {
    themeBtn.textContent = "☀️";
  }

});
