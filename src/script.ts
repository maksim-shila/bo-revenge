function sayHelloWorld(): void {
    const temp = document.getElementById("temp");
    if (temp) {
        temp.innerHTML = "Hello world!";
    }
}

sayHelloWorld();