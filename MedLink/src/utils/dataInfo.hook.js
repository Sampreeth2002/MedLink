import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const useDataInfo = (fetchInfoData, ifErrorRevertTo) => {
	const navigate = useNavigate()

	const [data, setData] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		;(async () => {
			try {
				const res = await fetchInfoData()
				setData(res)
			} catch (err) {
				setError(err)
				if (ifErrorRevertTo !== undefined) navigate(ifErrorRevertTo, { replace: true })
			}
		})()
	}, [navigate, ifErrorRevertTo, fetchInfoData])

	return { data, error }
}
