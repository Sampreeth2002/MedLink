import { useContext, useEffect, useState } from "react"
import { MedicalSystemContext } from "../components/App"

export const useCurrentUser = () => {
	const ctx = useContext(MedicalSystemContext)

	const [userType, setUserType] = useState("Guest")
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		;(async () => {
			const type = await ctx.medicalSystem.methods.login().call({ from: ctx.account })
			setUserType(type)

			switch (type) {
				case "Patient":
					const patient = await ctx.medicalSystem.methods.patients(ctx.account).call()
					setUser(patient)
					break
				case "Doctor":
					const doctor = await ctx.medicalSystem.methods.doctors(ctx.account).call()
					setUser(doctor)
					break
				default:
					break
			}
			setLoading(false)
		})()
	}, [])

	return { userType, user, loadingUser: loading }
}
