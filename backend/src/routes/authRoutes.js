import express from "express";

const router = express.Router();

// Mock/Phase 2 auth endpoints
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Demo personas login handler
  if (email && password) {
    let role = "customer";
    let name = "Demo User";
    if (email.includes("admin")) {
      role = "admin";
      name = "Vikram Aditya (Admin)";
    } else if (email.includes("priya") || email.includes("staff")) {
      role = "staff";
      name = "Priya Sharma (Account Exec)";
    } else {
      name = "Rajesh Nair (Customer)";
    }

    return res.json({
      success: true,
      token: "phase2_jwt_token_sample",
      user: {
        id: "usr_demo",
        name,
        email,
        role,
      },
      message: "Authentication successful",
    });
  }

  res.status(400).json({ success: false, message: "Email and password are required" });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

router.get("/me", (req, res) => {
  res.json({
    success: true,
    user: {
      id: "usr_demo",
      name: "Vikram Aditya",
      email: "admin@brightloop.io",
      role: "admin",
    },
  });
});

export default router;
