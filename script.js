// ==================== 🔥 Firebase Imports ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { storage } from "./firebase-config.js";

// ==================== 🔥 Firebase Config ====================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ==================== 🔹 Auth Helpers ====================
export function requireLogin() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

export function logoutUser() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}

// ==================== 🔹 Login Page ====================
export function initLoginForm() {
  const loginForm = document.getElementById("login-form");
  const feedback = document.getElementById("feedback");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html";
      } catch (err) {
        feedback.textContent = err.message;
      }
    });
  }

  const googleBtn = document.getElementById("google-login");
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, provider);
        window.location.href = "index.html";
      } catch (err) {
        feedback.textContent = err.message;
      }
    });
  }
}

// ==================== 🔹 Register Page ====================
export function initRegisterForm() {
  const registerForm = document.getElementById("register-form");
  const feedback = document.getElementById("feedback");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("reg-name").value;
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          bio: "",
          skillsOffered: "",
          skillsWanted: ""
        });

        window.location.href = "index.html";
      } catch (err) {
        feedback.textContent = err.message;
      }
    });
  }
}

// ==================== 🔹 Profile Page ====================

// Load Profile Data from Firestore
export async function loadProfile() {
  const user = auth.currentUser;
  if (!user) return;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    const data = userDoc.data();

    document.getElementById("profile-name").value = data.name || "";
    document.getElementById("profile-email").value = data.email || "";
    document.getElementById("profile-bio").value = data.bio || "";
    document.getElementById("profile-skillsOffered").value = data.skillsOffered || "";
    document.getElementById("profile-skillsWanted").value = data.skillsWanted || "";

    // ✅ Avatar auto-load
    const preview = document.getElementById("avatar-preview");
    if (data.avatar) {
      preview.src = data.avatar;
    } else {
      preview.src = "assets/images/avatar.png"; // default
    }

    // ✅ Navbar avatar auto-load
    const navAvatar = document.getElementById("nav-avatar");
    if (navAvatar) {
      navAvatar.src = data.avatar ? data.avatar : "assets/images/avatar.png";
    }
  }
}

// Save Profile Data to Firestore
export async function saveProfile() {
  const user = auth.currentUser;
  if (!user) return;

  const name = document.getElementById("profile-name").value;
  const email = document.getElementById("profile-email").value;
  const bio = document.getElementById("profile-bio").value;
  const skillsOffered = document.getElementById("profile-skillsOffered").value;
  const skillsWanted = document.getElementById("profile-skillsWanted").value;

  await updateDoc(doc(db, "users", user.uid), {
    name, email, bio, skillsOffered, skillsWanted
  });

  alert("✅ Profile updated successfully!");
}

// Avatar Upload + Save to Firestore
export function initAvatarUpload() {
  const fileInput = document.getElementById("profile-avatar");
  const preview = document.getElementById("avatar-preview");

  if (!fileInput) return;

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("❌ Please login first!");
        return;
      }

      // Firebase storage path
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save URL in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        avatar: downloadURL
      });

      // Show preview
      preview.src = downloadURL;

      // Update navbar avatar also
      const navAvatar = document.getElementById("nav-avatar");
      if (navAvatar) navAvatar.src = downloadURL;

      alert("✅ Avatar uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error uploading avatar: " + err.message);
    }
  });
}
// ==================== 🔹 Users Page ====================
export function initUsersPage() {
  const searchInput = document.getElementById("users-search") || document.getElementById("searchInput");
  const searchBtn = document.getElementById("users-search-btn") || document.getElementById("searchBtn");
  const usersList = document.getElementById("users-list");

  async function fetchUsers(filter = "") {
    usersList.innerHTML = "";
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (
        filter === "" ||
        data.name.toLowerCase().includes(filter.toLowerCase()) ||
        data.skillsOffered.toLowerCase().includes(filter.toLowerCase()) ||
        data.skillsWanted.toLowerCase().includes(filter.toLowerCase())
      ) {
        const div = document.createElement("div");
        div.className = "user-card";
      div.innerHTML = `
      <img src="${data.avatar ? data.avatar : "assets/images/avatar.png"}" 
       alt="${data.name}" 
       style="width:50px;height:50px;border-radius:50%;margin-bottom:10px;" />
  <h3>${data.name}</h3>
  <p><strong>Offers:</strong> ${data.skillsOffered || "-"}</p>
  <p><strong>Wants:</strong> ${data.skillsWanted || "-"}</p>
  <button class="view-btn">View</button>
`;
        div.querySelector(".view-btn").addEventListener("click", () => showUserModal(data));
        usersList.appendChild(div);
      }
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      fetchUsers(searchInput.value);
    });
  }

  fetchUsers();
}

// ==================== 🔹 Modal Logic ====================
function showUserModal(data) {
  const modal = document.getElementById("user-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");

  modalBody.innerHTML = `
    <img src="${data.avatar ? data.avatar : "assets/images/avatar.png"}" 
         alt="${data.name}" 
         style="width:80px;height:80px;border-radius:50%;margin-bottom:12px;" />
    <h3>${data.name}</h3>
    <p><strong>Email:</strong> ${data.email || "N/A"}</p>
    <p><strong>Offers:</strong> ${data.skillsOffered || "-"}</p>
    <p><strong>Wants:</strong> ${data.skillsWanted || "-"}</p>
    <p>${data.bio || ""}</p>
  `;

  modal.style.display = "flex";

  closeBtn.onclick = () => (modal.style.display = "none");
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
}

// ==================== 🔹 Dashboard ====================
export async function loadDashboard() {
  const user = auth.currentUser;
  if (!user) return;

  const eventsList = document.getElementById("my-events");
  const connectionsList = document.getElementById("my-connections");

  eventsList.innerHTML = "<li>No events yet.</li>";
  connectionsList.innerHTML = "<li>No connections yet.</li>";

  // 🔥 You can extend this with real event + connections logic
}
