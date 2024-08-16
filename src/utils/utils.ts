import axios from 'axios'

export const downloadPdf = async (url: string) => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await axios.get(url, { responseType: 'blob', headers })
    const file = new Blob([res.data], {
      type: 'application/pdf',
    })

    const fileURL = URL.createObjectURL(file)

    window.open(fileURL, '_blank')
  } catch (error) {
    throw new Error('Error al descargar el pdf')
  }
}

