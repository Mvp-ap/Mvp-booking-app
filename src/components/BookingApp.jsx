import React, { useState, useEffect } from "react";

function BookingApp() {
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list"); // list or calendar

  // Load from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem("appointments");
    if (saved) {
      setAppointments(JSON.parse(saved));
    }
  }, []);

  // Save appointments every time they change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = () => {
    if (!name.trim()) return alert("Name is required");
    if (!phone.trim()) return alert("Phone is required");
    if (!service.trim()) return alert("Service is required");
    if (!date.trim()) return alert("Date is required");

    const newAppt = {
      id: Date.now(),
      name,
      phone,
      service,
      date
    };

    setAppointments([...appointments, newAppt]);

    // reset
    setName("");
    setPhone("");
    setService("");
    setDate("");
  };

  const deleteAppointment = (id) => {
    if (!confirm("Delete appointment?")) return;
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  const filteredAppointments = appointments.filter((a) => {
    const text = `${a.name} ${a.phone} ${a.service}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const appointmentsByDate = filteredAppointments.reduce((acc, appt) => {
    const key = appt.date.split("T")[0]; // yyyy-mm-dd only
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {});

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      {/* HEADER */}
      <h1 style={{ textAlign: "center" }}>Business Booking App</h1>

      {/* SEARCH BAR */}
      <input
        placeholder="Search by name, phone or service..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 15,
          borderRadius: 8,
          border: "1px solid #aaa"
        }}
      />

      {/* VIEW SWITCH */}
      <div style={{ display: "flex", marginTop: 10, gap: 10 }}>
        <button
          onClick={() => setView("list")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            background: view === "list" ? "#222" : "#eee",
            color: view === "list" ? "#fff" : "#000"
          }}
        >
          List View
        </button>

        <button
          onClick={() => setView("calendar")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            background: view === "calendar" ? "#222" : "#eee",
            color: view === "calendar" ? "#fff" : "#000"
          }}
        >
          Calendar View
        </button>
      </div>

      {/* FORM */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 12,
          border: "1px solid #ccc",
          background: "#fafafa"
        }}
      >
        <h2>Add Appointment</h2>

        <input
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Service (e.g. physiotherapy)"
          value={service}
          onChange={(e) => setService(e.target.value)}
          style={inputStyle}
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <button onClick={addAppointment} style={buttonStyle}>
          Add Appointment
        </button>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <div style={{ marginTop: 20 }}>
          <h2>Appointments</h2>

          {filteredAppointments.length === 0 && (
            <p style={{ opacity: 0.6 }}>No appointments found</p>
          )}

          {filteredAppointments.map((appt) => (
            <div key={appt.id} style={cardStyle}>
              <strong>{appt.name}</strong>
              <p>📞 {appt.phone}</p>
              <p>🛠 {appt.service}</p>
              <p>📅 {new Date(appt.date).toLocaleString()}</p>

              <button
                onClick={() => deleteAppointment(appt.id)}
                style={deleteButtonStyle}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <div style={{ marginTop: 20 }}>
          <h2>Calendar</h2>

          {Object.keys(appointmentsByDate).length === 0 && (
            <p style={{ opacity: 0.6 }}>No appointments</p>
          )}

          {Object.keys(appointmentsByDate).map((day) => (
            <div key={day} style={calendarDayStyle}>
              <h3>{day}</h3>

              {appointmentsByDate[day].map((appt) => (
                <div key={appt.id} style={calendarApptStyle}>
                  <strong>{appt.name}</strong> — {appt.service}
                  <p>{new Date(appt.date).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLES BELOW (keep them at bottom to keep file clean) */
const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #bbb"
};

const buttonStyle = {
  marginTop: 15,
  width: "100%",
  padding: 12,
  borderRadius: 10,
  background: "#007bff",
  color: "#fff",
  border: "none",
  fontWeight: "bold"
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: 15,
  borderRadius: 12,
  marginBottom: 15,
  background: "#fff",
  boxShadow: "0 2px 3px rgba(0,0,0,0.08)"
};

const deleteButtonStyle = {
  marginTop: 10,
  padding: 8,
  background: "#ff3b30",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  width: "100%"
};

const calendarDayStyle = {
  padding: 15,
  border: "1px solid #ccc",
  borderRadius: 8,
  marginBottom: 15,
  background: "#f6f6f6"
};

const calendarApptStyle = {
  marginTop: 10,
  padding: 10,
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 8
};

export default BookingApp;
