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
  AnswerConfig,
  loadQuestionConfigs,
  saveQuestionConfigs,
  DEFAULT_QUESTION_CONFIGS,
} from '../data/questionConfig';
import { Edit2, Save, X, RotateCcw, Plus, Trash2 } from 'lucide-react';

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

  const handleWeightChange = (answerIndex: number, newWeight: number) => {
    if (editingQuestion && editingQuestion.answers[answerIndex]) {
      const updatedAnswers = [...editingQuestion.answers];
      updatedAnswers[answerIndex].weight = newWeight;
      setEditingQuestion({
        ...editingQuestion,
        answers: updatedAnswers
      });
    }
  };

  const handleRandomizeWeights = () => {
    if (editingQuestion) {
      const randomWeights = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      const updatedAnswers = editingQuestion.answers.map((answer, index) => ({
        ...answer,
        weight: randomWeights[index]
      }));
      setEditingQuestion({
        ...editingQuestion,
        answers: updatedAnswers,
        randomizeWeights: true
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
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium">Bobot Jawaban</label>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRandomizeWeights}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Acak Bobot
              </Button>
            </div>
            <div className="space-y-2">
              {editingQuestion.answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex-1">{answer.label}</span>
                  <Input
                    type="number"
                    min="0"
                    max="3"
                    value={answer.weight}
                    onChange={(e) => handleWeightChange(index, parseInt(e.target.value) || 0)}
                    className="w-20"
                  />
                </div>
              ))}
            </div>
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
                            {question.randomizeWeights ? '🎲 Acak' : 'Normal'}
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
