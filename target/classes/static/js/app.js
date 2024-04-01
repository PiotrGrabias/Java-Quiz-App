document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:8080/Quiz/all")
        .then(response => response.json())
        .then(data => displayQuizzes(data))
        .catch(error => console.error("Error fetching quizzes:", error));
});

function displayQuizzes(quizzes) {
    const quizContainer = document.getElementById("quiz-container");

    quizzes.forEach(quiz => {
        const quizDiv = document.createElement("div");
        quizDiv.innerHTML = `
            <h2>${quiz.title}</h2>
            <p>Category: ${quiz.category}</p>
            <p>${quiz.numQ} questions</p>
            <!-- Dodaj więcej informacji, jeśli to konieczne -->
        `;
        quizContainer.appendChild(quizDiv);
    });
}