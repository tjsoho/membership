"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoadingWave } from "./ui/LoadingWave";
import { showToast } from "@/utils/toast";

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium text-coastal-dark-teal">
                    Contact Us
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-coastal-dark-grey hover:text-coastal-dark-teal rounded-lg p-1 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                  }}
                  validationSchema={ContactSchema}
                  onSubmit={async (values, { resetForm }) => {
                    try {
                      const response = await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(values),
                      });

                      if (!response.ok)
                        throw new Error("Failed to send message");

                      showToast.success(
                        "Success",
                        "Message sent successfully!"
                      );
                      resetForm();
                      onClose();
                    } catch (error) {
                      showToast.error("Error", "Failed to send message");
                    }
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-4">
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                          <LoadingWave size="md" />
                        </div>
                      )}

                      <div>
                        <Field
                          name="name"
                          type="text"
                          placeholder="Your Name"
                          className="w-full px-4 py-2 rounded-lg border border-coastal-sand focus:border-coastal-dark-teal 
                                   focus:ring-1 focus:ring-coastal-dark-teal outline-none transition-colors"
                        />
                        {errors.name && touched.name && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </div>
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
                          <div className="text-red-500 text-sm mt-1">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <Field
                          name="subject"
                          type="text"
                          placeholder="Subject"
                          className="w-full px-4 py-2 rounded-lg border border-coastal-sand focus:border-coastal-dark-teal 
                                   focus:ring-1 focus:ring-coastal-dark-teal outline-none transition-colors"
                        />
                        {errors.subject && touched.subject && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.subject}
                          </div>
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
                          <div className="text-red-500 text-sm mt-1">
                            {errors.message}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-coastal-dark-teal text-white px-6 py-3 rounded-lg
                                 hover:bg-coastal-light-teal transition-colors duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        Send Message
                      </button>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
