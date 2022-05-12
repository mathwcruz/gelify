export const Loading = () => {
  return (
    <div className="mt-20 flex items-center justify-center">
      <div
        className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 text-green-500"
        role="status"
      >
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  )
}
