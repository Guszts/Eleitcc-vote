import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, Upload } from 'lucide-react';
import { Modal } from './Modal';
import { compressDataUrl, fileToDataUrl } from '../lib/imageUtils';
import { cn } from '../lib/utils';

interface PhotoSelectorProps {
  photoUrl: string;
  onChange: (url: string) => void;
}

export function PhotoSelector({ photoUrl, onChange }: PhotoSelectorProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setShowOptions(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      console.error("Camera access denied or unvailable", err);
      alert("Não foi possível acessar a câmera.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, showCamera]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const compressed = await compressDataUrl(dataUrl);
        onChange(compressed);
        stopCamera();
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      const compressed = await compressDataUrl(dataUrl);
      onChange(compressed);
      setShowOptions(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 shrink-0 rounded-2xl bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={32} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setShowOptions(true)}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition-colors"
          >
            {photoUrl ? 'Trocar Foto' : 'Adicionar Foto'}
          </button>
          <p className="text-xs text-gray-500 mt-2 font-medium">Recomendado enviar uma foto para melhor identificação.</p>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <Modal isOpen={showOptions} onClose={() => setShowOptions(false)} title="Como deseja adicionar a foto?">
        <div className="grid grid-cols-2 gap-4 pb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-colors gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <Upload size={24} className="text-gray-900" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Escolher imagem</span>
          </button>

          <button
            type="button"
            onClick={startCamera}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl transition-colors gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <Camera size={24} className="text-gray-900" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Câmera</span>
          </button>
        </div>
      </Modal>

      <Modal isOpen={showCamera} onClose={stopCamera} title="Tire sua foto">
        <div className="space-y-4 pb-4">
          <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={capturePhoto}
            className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Camera size={20} /> Capturar
          </button>
        </div>
      </Modal>
    </div>
  );
}
