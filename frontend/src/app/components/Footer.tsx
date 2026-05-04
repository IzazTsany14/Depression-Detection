import React from 'react';
import { Brain, Mail, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">MindCheck</span>
                <p className="text-xs text-gray-500">Deteksi Dini Depresi</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Sistem skrining mandiri tingkat depresi menggunakan instrumen DASS-21 dan metode Logika Fuzzy.
            </p>
          </div>

          {/* Tentang Penelitian */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tentang Penelitian</h3>
            <p className="text-sm text-gray-600 mb-2">
              Proyek Skripsi: Sistem Deteksi Dini Tingkat Depresi Mahasiswa
            </p>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Untuk informasi lebih lanjut, hubungi peneliti</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Disclaimer
            </h3>
            <p className="text-sm text-gray-600">
              Sistem ini hanya untuk skrining awal dan <strong>bukan pengganti diagnosis profesional</strong>. 
              Jika Anda mengalami gejala depresi, segera konsultasi dengan psikolog atau psikiater.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 MindCheck. Dikembangkan untuk keperluan penelitian akademik.
          </p>
          <div className="flex gap-4">
            <Link to="/about" className="text-sm text-gray-500 hover:text-blue-600">
              Tentang DASS-21
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Privasi & Keamanan Data</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
