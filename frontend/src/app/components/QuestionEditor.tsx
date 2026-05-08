import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  ConfigurableQuestion,
  loadQuestionConfigs,
  saveQuestionConfigs,
  DEFAULT_QUESTION_CONFIGS,
} from '../pages/bk/questionConfig';
import { Edit2, Save, X, RotateCcw } from 'lucide-react';

interface QuestionEditorProps {
  onSave?: (questions: ConfigurableQuestion[]) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ onSave }) => {
  const [questions, setQuestions] = useState<ConfigurableQuestion[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<ConfigurableQuestion | null>(null);
  const [activeTab, setActiveTab] = useState<'depression' | 'anxiety' | 'stress'>('depression');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load questions on component mount
  useEffect(() => {
    const loaded = loadQuestionConfigs();
    setQuestions(loaded);
  }, []);

  const handleEditStart = (question: ConfigurableQuestion) => {
    setEditingId(question.id);
    setEditingQuestion(JSON.parse(JSON.stringify(question)));
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingQuestion(null);
  };

  const handleEditSave = () => {
    if (editingQuestion) {
      const updated = questions.map(q => q.id === editingQuestion.id ? editingQuestion : q);
      setQuestions(updated);
      setEditingId(null);
      setEditingQuestion(null);
    }
  };

  const handleQuestionTextChange = (text: string) => {
    if (editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        text
      });
    }
  };

  const handleSaveAllChanges = () => {
    saveQuestionConfigs(questions);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    if (onSave) {
      onSave(questions);
    }
  };

  const handleResetToDefault = () => {
    setShowResetDialog(false);
    // Gunakan konstanta yang sudah diimpor dan buat salinan data untuk mencegah mutasi
    setQuestions(JSON.parse(JSON.stringify(DEFAULT_QUESTION_CONFIGS)));
  };

  const filteredQuestions = questions.filter(q => q.subscale === activeTab);

  const renderEditingQuestion = () => {
    if (!editingQuestion) return null;

    return (
      <Card className="p-6 mb-4 border-blue-500 bg-blue-50">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Teks Pertanyaan</label>
            <textarea
              value={editingQuestion.text}
              onChange={(e) => handleQuestionTextChange(e.target.value)}
              className="w-full p-2 border rounded min-h-[80px]"
              placeholder="Masukkan teks pertanyaan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Bobot Jawaban {editingQuestion.reverseScored ? 'Terbalik' : 'Standar'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {editingQuestion.answers.map((answer, index) => (
                <div key={index} className="p-3 bg-white border rounded text-sm text-center">
                  <div className="text-xs text-gray-600">{answer.label}</div>
                  <div className="font-semibold text-lg">{answer.weight}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {editingQuestion.reverseScored
                ? 'Pertanyaan ini bernada positif, sehingga bobot dibalik: Tidak pernah=3, Kadang-kadang=2, Sering=1, Sangat sering=0.'
                : 'Pertanyaan ini bernada gejala, sehingga bobot standar: Tidak pernah=0, Kadang-kadang=1, Sering=2, Sangat sering=3.'}
            </p>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleEditSave}
              className="gap-2"
              variant="default"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
            <Button
              onClick={handleEditCancel}
              variant="outline"
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Batal
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✓ Perubahan berhasil disimpan!
        </div>
      )}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="depression">Depresi ({questions.filter(q => q.subscale === 'depression').length})</TabsTrigger>
          <TabsTrigger value="anxiety">Kecemasan ({questions.filter(q => q.subscale === 'anxiety').length})</TabsTrigger>
          <TabsTrigger value="stress">Stres ({questions.filter(q => q.subscale === 'stress').length})</TabsTrigger>
        </TabsList>

        {['depression', 'anxiety', 'stress'].map((subscale) => (
          <TabsContent key={subscale} value={subscale as any}>
            <div className="space-y-4">
              {/* Editing Section */}
              {editingQuestion?.subscale === subscale && renderEditingQuestion()}

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <Card className="p-4 text-center text-gray-500">
                    Tidak ada pertanyaan untuk kategori ini
                  </Card>
                ) : (
                  filteredQuestions.map((question) => (
                    <Card key={question.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="font-medium mb-2">
                              Pertanyaan #{question.id}
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{question.text}</p>
                          </div>
                          <Badge variant="outline">
                            {question.reverseScored ? 'Bobot Terbalik' : 'Bobot Standar'}
                          </Badge>
                        </div>

                        {editingId !== question.id && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-gray-600">Bobot Jawaban:</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {question.answers.map((answer, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 bg-gray-100 rounded text-sm text-center"
                                >
                                  <div className="text-xs text-gray-600">{answer.label}</div>
                                  <div className="font-semibold text-lg">{answer.weight}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {editingId !== question.id && (
                          <div className="flex gap-2 pt-3 border-t">
                            <Button
                              onClick={() => handleEditStart(question)}
                              size="sm"
                              variant="outline"
                              className="gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white p-4 -m-6 p-6">
        <Button
          onClick={handleSaveAllChanges}
          className="gap-2"
          size="lg"
        >
          <Save className="w-5 h-5" />
          Simpan Semua Perubahan
        </Button>
        <Button
          onClick={() => setShowResetDialog(true)}
          variant="outline"
          className="gap-2"
          size="lg"
        >
          <RotateCcw className="w-5 h-5" />
          Reset ke Default
        </Button>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Reset Pertanyaan?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan mengembalikan semua pertanyaan dan bobot ke nilai default. Perubahan yang sudah disimpan akan dihapus.
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetToDefault} className="bg-red-600">
              Reset
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
