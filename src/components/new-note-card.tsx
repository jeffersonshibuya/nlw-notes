import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function NewNoteCard() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if(event.target.value === '') setShouldShowOnboarding(true)
    setContent(event.target.value)
  }

  function handleSaveNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success('Nota criada com sucesso!')
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
      <Dialog.Content className='z-10 left-1/2 top-1/2 -translate-x-1/2
        -translate-y-1/2 max-w-[640px] h-[60vh] w-full bg-slate-700 rounded-md flex flex-col
        outline-none overflow-hidden fixed
      '>
        <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 
          text-slate-400 hover:text-slate-100'>
          <X className='size-5'/>
        </Dialog.Close>

        <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <span>
              Adicionar nota
            </span>
            {shouldShowOnboarding ? (
              <p className='text-sm leading-6 text-slate-400'>
              Começe <button className='font-medium text-lime-400 hover:underline'>
              gravando uma nota</button> ou se preferir {' '}
              <button
                onClick={handleStartEditor} 
                className='font-medium text-lime-400 hover:underline'>
                utilize apenas texto
              </button>
            </p>
            ) : (
              <textarea 
                autoFocus
                onChange={handleContentChange}
                placeholder='escreva sua nota...'
                className='text-sm leading-6 text-slate-400 bg-transparent resize-none
                flex-1 outline-none'
              >

              </textarea>
            )}
          </div>
          <button type='submit' className='w-full bg-lime-400 py-4 text-center text-sm 
            text-lime-950 ouline-none font-medium hover:bg-lime-500'>
            Salvar nota
          </button>
        </form>
        
      </Dialog.Content>
    </Dialog.Portal>
    </Dialog.Root>
  )
}