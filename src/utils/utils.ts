import axios from 'axios'

export const downloadPdf = async (url: string) => {
  try {
    const res = await axios.get(url, { responseType: 'blob' })
    const file = new Blob([res.data], {
      type: 'application/pdf',
    })

    const fileURL = URL.createObjectURL(file)

    window.open(fileURL, '_blank')
  } catch (error) {
    throw new Error('Error al descargar el pdf')
  }
}
