const counts = { special: 2, food: 12, drinks: 12 };
const names = { special: "Special Menu", food: "Food Menu", drinks: "Drinks Menu" };
const galleries = {
  special: document.getElementById("special"),
  food: document.getElementById("food"),
  drinks: document.getElementById("drinks")
};
let currentCategory = "special";
let currentIndex = 1;

function imagePath(category, number) {
  return `images/${category}/${category}-${String(number).padStart(2, "0")}.jpeg`;
}
function buildGallery(category) {
  const gallery = galleries[category];
  for (let i = 1; i <= counts[category]; i++) {
    const card = document.createElement("button");
    card.className = "menu-card";
    card.type = "button";
    card.setAttribute("aria-label", `${names[category]} photo ${i}`);
    const img = document.createElement("img");
    img.src = imagePath(category, i);
    img.alt = `${names[category]} photo ${i}`;
    img.loading = "lazy";
    img.onerror = () => {
      img.remove();
      const missing = document.createElement("div");
      missing.className = "missing";
      missing.innerHTML = `<span><strong>${names[category]} · Photo ${String(i).padStart(2,"0")}</strong><br>Add your photo at<br><code>${imagePath(category, i)}</code></span>`;
      card.insertBefore(missing, card.firstChild);
    };
    const label = document.createElement("span");
    label.className = "number";
    label.textContent = `${names[category]} · ${category === "special" ? "Photo" : "Page"} ${String(i).padStart(2, "0")}`;
    card.append(img, label);
    card.addEventListener("click", () => openViewer(category, i));
    gallery.appendChild(card);
  }
}
function switchCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".tab").forEach(btn => {
    const active = btn.dataset.category === category;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", String(active));
  });
  Object.keys(galleries).forEach(key => {
    galleries[key].hidden = key !== category;
    galleries[key].classList.toggle("active", key === category);
  });
}
document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => switchCategory(btn.dataset.category)));

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const viewerCaption = document.getElementById("viewerCaption");
function openViewer(category, index) {
  currentCategory = category; currentIndex = index;
  viewerImage.src = imagePath(category, index);
  viewerImage.alt = `${names[category]} photo ${index}`;
  const itemType = category === "special" ? "Photo" : "Page";
  viewerCaption.textContent = `${names[category]} · ${itemType} ${String(index).padStart(2, "0")} of ${counts[category]}`;
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeViewer() {
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function moveImage(delta) {
  currentIndex += delta;
  if (currentIndex < 1) currentIndex = counts[currentCategory];
  if (currentIndex > counts[currentCategory]) currentIndex = 1;
  openViewer(currentCategory, currentIndex);
}
document.getElementById("closeViewer").addEventListener("click", closeViewer);
document.getElementById("prevImage").addEventListener("click", () => moveImage(-1));
document.getElementById("nextImage").addEventListener("click", () => moveImage(1));
viewer.addEventListener("click", e => { if (e.target === viewer) closeViewer(); });
document.addEventListener("keydown", e => {
  if (!viewer.classList.contains("open")) return;
  if (e.key === "Escape") closeViewer();
  if (e.key === "ArrowLeft") moveImage(-1);
  if (e.key === "ArrowRight") moveImage(1);
});
buildGallery("special");
buildGallery("food");
buildGallery("drinks");
