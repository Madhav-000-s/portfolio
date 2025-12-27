"use client"

import { useState } from "react"
import Image from "next/image"
import { Send, Mail } from "lucide-react"
import { socials, CONTACT_EMAIL } from "@/constants"
import useWindowStore from "@/store/useWindowStore"

const Contact = () => {
  const { closewindow, minimizewindow } = useWindowStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`)
  }

  return (
    <div id="contact">
      {/* Window Header */}
      <div id="window-header">
        <h2>Contact</h2>
        <div id="window-controls">
          <div className="minimize" onClick={() => minimizewindow("contact")} />
          <div className="maximize" />
          <div className="close" onClick={() => closewindow("contact")} />
        </div>
      </div>

      <div className="contact-content">
        {/* Social Links Section */}
        <div className="contact-socials">
          <h3>Connect with me</h3>
          <div className="social-links">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                style={{ backgroundColor: social.bg }}
              >
                <Image
                  src={social.icon}
                  alt={social.text}
                  width={20}
                  height={20}
                />
                <span>{social.text}</span>
              </a>
            ))}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="social-link"
              style={{ backgroundColor: "#ea4335" }}
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="contact-form-section">
          <h3>Send a message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={4}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

Contact.displayName = "Contact"

export default Contact
