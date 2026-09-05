"use client";

import { FormEvent } from "react";
import { ArrowRight } from "lucide-react";

const email = "vinodyatharuki@gmail.com";

export function ContactForm() {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const subject = String(form.get("subject") ?? "Portfolio enquiry").trim();
    const message = String(form.get("message") ?? "").trim();
    const body = `${message}\n\nFrom: ${name}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <p>Send a message</p>
      <div className="contact-fields">
        <label><span className="sr-only">Name</span><input name="name" type="text" placeholder="Your name" autoComplete="name" required /></label>
        <label><span className="sr-only">Subject</span><input name="subject" type="text" placeholder="Subject" required /></label>
      </div>
      <label><span className="sr-only">Message</span><textarea name="message" placeholder="Your message..." rows={6} required /></label>
      <button type="submit">Send message <ArrowRight size={18} /></button>
    </form>
  );
}
