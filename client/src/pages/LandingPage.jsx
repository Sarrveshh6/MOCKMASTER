import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PatternText } from '../components/ui/pattern-text';
import { HandWrittenTitle } from '../components/ui/hand-writing-text';

const LandingPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const steps = [
        {
            number: 1,
            title: "Upload Your Material",
            description: "Drag and drop your PDF course materials, notes, or textbooks directly into our secure scanner.",
            color: "bg-[#F0A6CA]"
        },
        {
            number: 2,
            title: "AI Generation",
            description: "Our state-of-the-art AI extracts key concepts and generates high-quality MCQs in seconds.",
            color: "bg-[#A0FF9C]"
        },
        {
            number: 3,
            title: "Excel & Analyze",
            description: "Take the tests, review your performance, and track your progress over time with deep analytics.",
            color: "bg-[#FCEB7B]"
        }
    ];

    const faqs = [
        {
            question: "How accurate is the AI-generated content?",
            answer: "MOCKMASTER uses advanced Large Language Models specifically fine-tuned for educational context extraction, ensuring over 95% accuracy in concept identification."
        },
        {
            question: "How does the AI extract questions from PDFs?",
            answer: "Our advanced AI uses Optical Character Recognition (OCR) and Natural Language Processing (NLP) to parse your documents, identify key technical concepts, and generate contextual MCQs, True/False, and descriptive questions."
        },
        {
            question: "Are there any limits on file size or page count?",
            answer: "Registered users can upload PDFs up to 50MB and 200 pages. Our AI can handle complex diagrams and technical text with ease."
        },
        {
            question: "Can I use MOCKMASTER for free?",
            answer: "Yes! New users get a generous amount of free credits to generate tests. We also offer premium plans for unlimited extractions and advanced analytics."
        },
        {
            question: "What file formats are supported?",
            answer: "Currently, we support PDF files, including scanned documents and images. We are expanding to support .docx and .txt files soon."
        },
        {
            question: "Can I export questions to other platforms?",
            answer: "Currently, you can save questions to your personal Question Bank. We are working on exporting to PDF and Quizlet formats in the coming weeks!"
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. All uploaded documents are encrypted and used solely for generating your test content. We never share your notes or personal data with third parties."
        },
        {
            question: "How do I track my progress?",
            answer: "Every test you take is recorded in your Analytics dashboard. You can see your score trends, accuracy by subject, and identify weak areas that need more focus."
        },
        {
            question: "Can I share my tests with friends?",
            answer: "Currently, tests are private to your account. However, we are building a 'Group Study' feature where you can share question banks with your classmates!"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FCF5E5] pt-24 pb-12 font-sans selection:bg-[#FCEB7B]">
            {/* Hero Section */}
            <section className="px-6 md:px-12 py-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                <div className="flex-1 z-10">
                    <div className="inline-block bg-[#FCEB7B] border-2 border-black px-4 py-1 font-black text-xs uppercase mb-6 shadow-[2px_2px_0px_#000]">
                        AI-Powered Learning
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
                        Turn Your PYQs <br />
                        into <span className="highlight-green px-2">Mock Tests</span>
                    </h1>
                    <p className="text-lg md:text-xl font-bold text-gray-800 mb-10 max-w-xl leading-relaxed">
                        The ultimate tool for students and educators. Generate comprehensive practice exams from any PDF material in seconds.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/register" className="neo-brutal-btn bg-[#FCEB7B] border-3 text-lg px-8 py-4">
                            Get Started →
                        </Link>
                        <Link to="/login" className="neo-brutal-btn bg-black text-white border-3 text-lg px-8 py-4">
                            Login
                        </Link>
                    </div>
                </div>
                
                <div className="flex-1 relative">
                    <div className="stacked-card bg-white p-8 border-3 border-black w-full max-w-lg aspect-square flex flex-col justify-center items-center shadow-[12px_12px_0px_#000]">
                        <div className="w-full h-full border-2 border-dashed border-black flex items-center justify-center bg-[#FCEB7B]/10">
                            <PatternText text="MOCK" className="text-6xl md:text-8xl opacity-20 rotate-[-15deg]" />
                        </div>
                    </div>
                    {/* Decorative Doodles */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#F0A6CA] border-3 border-black rounded-full doodle-pulse shadow-[4px_4px_0px_#000]"></div>
                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#A0FF9C] border-3 border-black rotate-12 shadow-[4px_4px_0px_#000]"></div>
                </div>
            </section>

            {/* Procedure Section */}
            <section id="how-it-works" className="bg-[#F0A6CA]/20 py-24 border-y-3 border-black relative">
                <div className="px-6 md:px-12 max-w-6xl mx-auto">
                    <div className="flex flex-col items-center mb-8">
                        <span className="bg-[#FCEB7B] border-2 border-black px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_#000]">Simple Process</span>
                        <HandWrittenTitle title="How It Works" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {steps.map((step) => (
                            <div key={step.number} className="flex flex-col items-center text-center">
                                <div className={`w-20 h-20 ${step.color} border-3 border-black rounded-full flex items-center justify-center text-3xl font-black shadow-[6px_6px_0px_#000] mb-8`}>
                                    {step.number}
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase">{step.title}</h3>
                                <p className="font-bold text-gray-700 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-10 left-10 text-4xl opacity-20 font-black select-none">SCANNING...</div>
                <div className="absolute bottom-10 right-10 text-4xl opacity-20 font-black select-none">READY.</div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 px-6 md:px-12 bg-[#FCF5E5]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="bg-black text-white border-2 border-white px-4 py-1 font-black text-xs uppercase shadow-[2px_2px_0px_#000]">FAQ ?</span>
                        <h2 className="text-4xl md:text-6xl font-black mt-6">Frequently Asked <span className="highlight-pink px-2">Questions</span></h2>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-3 border-black bg-white shadow-[6px_6px_0px_#000] overflow-hidden">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FCEB7B] transition-colors"
                                >
                                    <span className="text-xl font-black uppercase">{faq.question}</span>
                                    <div className={`w-8 h-8 border-2 border-black flex items-center justify-center font-black transition-transform ${openFaq === index ? 'rotate-180 bg-[#F0A6CA]' : 'bg-white'}`}>
                                        ▼
                                    </div>
                                </button>
                                {openFaq === index && (
                                    <div className="p-6 border-t-3 border-black font-bold text-gray-700 leading-relaxed bg-[#FCF5E5]">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
