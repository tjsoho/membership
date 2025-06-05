"use client";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { showToast } from "../utils/toast";

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
});

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Formik
      initialValues={{ name: "", email: "", message: "" }}
      validationSchema={ContactSchema}
      onSubmit={async (values, { resetForm }) => {
        setIsSubmitting(true);
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          if (!response.ok) throw new Error("Failed to send message");

          showToast.success("Success", "Message sent successfully!");
          resetForm();
        } catch (error) {
          showToast.error("Error", "Failed to send message");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="space-y-6">
          <div>
            <Field
              name="name"
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-lg border border-coastal-sand focus:border-coastal-dark-teal 
                       focus:ring-1 focus:ring-coastal-dark-teal outline-none transition-colors"
            />
            {errors.name && touched.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <Field
              name="email"
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded-lg border border-coastal-sand focus:border-coastal-dark-teal 
                       focus:ring-1 focus:ring-coastal-dark-teal outline-none transition-colors"
            />
            {errors.email && touched.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <div>
            <Field
              as="textarea"
              name="message"
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-2 rounded-lg border border-coastal-sand focus:border-coastal-dark-teal 
                       focus:ring-1 focus:ring-coastal-dark-teal outline-none transition-colors"
            />
            {errors.message && touched.message && (
              <div className="text-red-500 text-sm mt-1">{errors.message}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-coastal-dark-teal text-white px-6 py-3 rounded-lg
                     hover:bg-coastal-light-teal transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
