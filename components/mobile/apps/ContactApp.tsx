"use client"

import { useState } from "react"
import Image from "next/image"
import { Mail, Send } from "lucide-react"
import { socials, CONTACT_EMAIL } from "@/constants"

export default function ContactApp() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`)
  }

  const inputClasses =
    "w-full rounded-lg bg-[#2b2b2b] border border-[#3d3d3d] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0078d4]"

  return (
    <div className="p-4 flex flex-col gap-6">
      <div>
        <h3 className="text-white text-sm font-semibold mb-3">Connect with me</h3>
        <div className="flex flex-col gap-2">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-white text-sm font-medium active:scale-[0.98] transition-transform"
              style={{ backgroundColor: social.bg }}
            >
              <Image src={social.icon} alt={social.text} width={20} height={20} className="invert" />
              {social.text}
            </a>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-white text-sm font-medium active:scale-[0.98] transition-transform"
            style={{ backgroundColor: "#ea4335" }}
          >
            <Mail className="w-5 h-5" />
            Email
          </a>
        </div>
      </div>

      <div>
        <h3 className="text-white text-sm font-semibold mb-3">Send a message</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className={inputClasses}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className={inputClasses}
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={4}
            required
            className={inputClasses}
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#0078d4] px-4 py-3 text-white text-sm font-medium active:scale-[0.98] transition-transform"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
