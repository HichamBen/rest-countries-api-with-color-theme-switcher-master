let r = document.querySelector(":root");
var mode = "L";

// Create a function for setting a variable value
function setColor() {

  if (mode === "L") {
    r.style.setProperty("--white", "hsl(209, 23%, 22%)")
    r.style.setProperty("--lightG", "hsl(207, 26%, 17%)");
    r.style.setProperty("--darkB", "white");
    r.style.setProperty("--darkG", "white");
    r.style.setProperty("--boxShadow", "hsl(207, 26%, 20%)");
    r.style.setProperty("--lightGr", "hsl(209, 23%, 22%)");
    mode = "D";

  } else {
    r.style.setProperty("--white", "white")
    r.style.setProperty("--lightG", "hsl(0, 0%, 98%)");
    r.style.setProperty('--darkB', 'hsl(200, 15%, 8%)');
    r.style.setProperty('--darkG', "hsl(0, 0%, 52%)");
    r.style.setProperty('--boxShadow', "hsl(0, 0%, 95%)");
    r.style.setProperty("--lightGr", "hsl(0, 0%, 98%)");
    mode = "L"
  }
}


document.querySelector("nav").addEventListener("click", setColor);