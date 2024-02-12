import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechReconignition: SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if(event.target.value === '') setShouldShowOnboarding(true)
    setContent(event.target.value)
  }

  function handleSaveNote() {
    if(content === '') return
    onNoteCreated(content)
    toast.success('Nota criada com sucesso!')
    setContent('')
    setShouldShowOnboarding(true)
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window
    
    if(!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação")
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechReconignition = new SpeechRecognitionAPI()
    speechReconignition.lang = 'pt-BR'
    speechReconignition.continuous = true
    speechReconignition.maxAlternatives = 1
    speechReconignition.interimResults = true
    speechReconignition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')
      setContent(transcription)
    }
    speechReconignition.onerror = (event) => {
      console.error(event)
    }
    speechReconignition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)
    speechReconignition?.stop()
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md p-5 flex flex-col text-left 
        bg-slate-700 gap-3 hover:ring-2 hover:ring-slate-600 outline-none 
        focus-visible:ring-2 focus-visible:ring-lime-400  '>
        <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
      <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
      <Dialog.Content className='z-10 md:left-1/2 md:top-1/2 md:-translate-x-1/2
        md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] md:inset-auto inset-0 
        w-full bg-slate-700 md:rounded-md flex flex-col
        outline-none overflow-hidden fixed
      '>
        <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 
          text-slate-400 hover:text-slate-100'>
          <X className='size-5'/>
        </Dialog.Close>

        <form className='flex-1 flex flex-col'>
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <span>
              Adicionar nota
            </span>
            {shouldShowOnboarding ? (
              <p className='text-sm leading-6 text-slate-400'>
              Começe {' '}
              <button 
                type='button'
                onClick={handleStartRecording}
                className='font-medium text-lime-400 hover:underline'>
               gravando uma nota
              </button> ou se preferir {' '}
              <button
                type='button'
                onClick={handleStartEditor} 
                className='font-medium text-lime-400 hover:underline'>
                utilize apenas texto
              </button>
            </p>
            ) : (
              <textarea 
                autoFocus
                onChange={handleContentChange}
                value={content}
                placeholder='escreva sua nota...'
                className='text-sm leading-6 text-slate-400 bg-transparent resize-none
                flex-1 outline-none'
              >

              </textarea>
            )}
          </div>
          
          {isRecording ? (
            <button 
              type='button' 
              onClick={handleStopRecording} 
              className='w-full bg-slate-900 py-4 flex
              text-center text-sm text-slate-300 ouline-none font-medium 
              hover:text-slate-100 items-center justify-center gap-2'>
              <div className='size-3 flex rounded-full bg-red-500 animate-pulse'/>
              Gravando! (clique para interromper)
            </button>
          ) : (
            <button 
              type='button'
              onClick={handleSaveNote} 
              className='w-full bg-lime-400 py-4 text-center text-sm 
              text-lime-950 ouline-none font-medium hover:bg-lime-500'>
              Salvar nota
            </button>
          )}
          
        </form>
        
      </Dialog.Content>
    </Dialog.Portal>
    </Dialog.Root>
  )
}