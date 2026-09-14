import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function User() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const result = await fetch(`${API_URL}/api/user/password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await result.json();

      if (result.ok) {
        setMessage(data.message);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(data.message || "Password change failed.");
      }
    } catch (error) {
      console.log("==>Change password error:", error);
      setErrorMessage("Cannot connect to the server.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          User Management
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Change User Password
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="User Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            fullWidth
          />

          {errorMessage && (
            <Typography color="error">
              {errorMessage}
            </Typography>
          )}

          {message && (
            <Typography color="success.main">
              {message}
            </Typography>
          )}

          <Button type="submit" variant="contained">
            Change Password
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}