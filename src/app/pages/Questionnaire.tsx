import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { DASS21_QUESTIONS, ANSWER_OPTIONS } from '../data/dass21Questions';
import { calculateDepressionScore, getDepressionLevel } from '../utils/fuzzyLogic';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export const Questionnaire: React.FC = () => {
  const { user, isGuest, saveTestResult, setCurrentTestAnswers } = useAuth();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(21).fill(-1));
  const [error, setError] = useState('');

  useEffect(() => {
    // If neither guest nor logged in, redirect to home
    if (!isGuest && !user) {
      navigate('/');
    }
  }, [isGuest, user, navigate]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
    setError('');
  };

  const handleNext = () => {
    if (answers[currentQuestion] === -1) {
      setError('Silakan pilih salah satu jawaban sebelum melanjutkan');
      return;
    }

    if (currentQuestion < DASS21_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setError('');
    }
  };

  const handleSubmit = () => {
    if (answers[currentQuestion] === -1) {
      setError('Silakan pilih salah satu jawaban sebelum melanjutkan');
      return;
    }

    // Check if all questions are answered
    if (answers.some(a => a === -1)) {
      setError('Mohon jawab semua pertanyaan sebelum menyelesaikan tes');
      return;
    }

    // Calculate score
    const score = calculateDepressionScore(answers);
    const level = getDepressionLevel(score);

    // Save test result if registered user
    if (user && !isGuest) {
      const result = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score: level.score,
        level: level.level,
        answers: answers,
      };
      saveTestResult(result);
      navigate('/result/registered');
    } else {
      // For guest, store answers temporarily
      setCurrentTestAnswers(answers);
      navigate('/result/guest');
    }
  };

  const progress = ((currentQuestion + 1) / DASS21_QUESTIONS.length) * 100;
  const question = DASS21_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Guest Notice */}
          {isGuest && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Anda login sebagai <strong>Guest</strong>. Hasil tidak akan tersimpan setelah keluar dari website.
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Pertanyaan {currentQuestion + 1} dari {DASS21_QUESTIONS.length}
              </h2>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% selesai
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="p-6 md:p-8 mb-6 shadow-lg">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                Pertanyaan {currentQuestion + 1}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                {question.text}
              </h3>
              <p className="text-sm text-gray-500 mt-3">
                Pilih jawaban yang paling sesuai dengan kondisi Anda <strong>dalam seminggu terakhir</strong>
              </p>
            </div>

            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <RadioGroup
              value={answers[currentQuestion].toString()}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {ANSWER_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    answers[currentQuestion] === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`q${currentQuestion}-option${option.value}`}
                  />
                  <Label
                    htmlFor={`q${currentQuestion}-option${option.value}`}
                    className="flex-1 cursor-pointer text-base font-medium"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Sebelumnya
            </Button>

            {currentQuestion === DASS21_QUESTIONS.length - 1 ? (
              <Button
                size="lg"
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                Lihat Hasil
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                Selanjutnya
                <ArrowRight className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Navigasi Cepat:</p>
            <div className="flex flex-wrap gap-2">
              {DASS21_QUESTIONS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[index] !== -1
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
