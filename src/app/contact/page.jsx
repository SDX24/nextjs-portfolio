import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="container py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Contact Me
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Have a question or want to work together? Feel free to reach out!
        </p>
      </div>
      <ContactForm />
    </div>
  );
}