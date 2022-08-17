const { assert } = require("chai")

require("chai")
	.use(require("chai-as-promised"))
	.should()

const MedicalSystem = artifacts.require("./MedicalSystem.sol")

contract("MedicalSystem", ([deployer, patient, doctor]) => {
	let system

	before(async () => {
		system = await MedicalSystem.deployed()
	})

	describe("deployment", async () => {
		it("deploys successfully", async () => {
			const address = await system.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, "")
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})

		it("has a name", async () => {
			const name = await system.name()
			assert.equal(name, "Hack-a-thon")
		})
	})

	describe("testing sytem", async () => {
		let patientCount, doctorCount, patientCreated, doctorCreated

		before(async () => {
			patientCreated = await system.createPatient("Sampreeth", 21, { from: patient })
			doctorCreated = await system.createDoctor("Ritvik", { from: doctor })
			patientCount = await system.patientCount()
			doctorCount = await system.doctorCount()
		})

		it("patient created", async () => {
			assert.equal(patientCount, 1)
			const event = patientCreated.logs[0].args

			assert.equal(event.id, patient, "incorrect id")
			assert.equal(event.name, "Sampreeth", "incorrect name")
			assert.equal(event.age.toNumber(), 21, "incorrect age")
		})

		it("doctor created", async () => {
			assert.equal(doctorCount, 1)
			const event = doctorCreated.logs[0].args

			assert.equal(event.id, doctor, "incorrect id")
			assert.equal(event.name, "Ritvik", "incorrect name")
		})

		it("record uploaded", async () => {
			const result = await system.uploadPatientRecord("www.sampreeth.com", { from: patient })
			const event = result.logs[0].args

			assert.equal(event.patientId, patient, "incorrect patient id while uploading")
			assert.equal(event.newRecordId, 1, "incorrect number of records while uploading")
			assert.closeTo(
				event.uploadDate.toNumber(),
				new Date().getTime() / 1000,
				3,
				"invalid upload date"
			)
		})

		it("fetching the patient", async () => {
			const result = await system.patients(patient)

			assert.equal(result.id, patient, "incorrect id")
			assert.equal(result.name, "Sampreeth", "incorrect name")
			assert.equal(result.age.toNumber(), 21, "incorrect age")
			assert.equal(result.totalRecords.toNumber(), 1, "incorrect total records")
		})

		it("fetching the patient record", async () => {
			const result = await system.getPatientRecord(patient, 1, { from: patient })
			assert.equal(
				result.ipfsHash,
				"www.sampreeth.com",
				"record fetched is not correct after uploading document"
			)
			assert.exists(result.uploadDate, "record fetched does not have an upload date")
		})

		it("fetching patient record as doctor without permission", () => {
			system
				.getPatientRecord(patient, 1, { from: doctor })
				.should.be.rejectedWith("Patient has not provided permission for the Doctor")
		})

		it("giving permission to doctor", async () => {
			const result = await system.givePermission(doctor, { from: patient })
			const event = result.logs[0].args

			assert.equal(event.patientId, patient, "incorrect patient provision")
			assert.equal(event.doctorId, doctor, "incorrect doctor provision")
		})

		it("fetching patient record as doctor with permission", async () => {
			const result = await system.getPatientRecord(patient, 1, { from: doctor })
			assert.equal(
				result.ipfsHash,
				"www.sampreeth.com",
				"record fetched is not correct after uploading document"
			)
			assert.exists(result.uploadDate, "record fetched does not have an upload date")
		})
	})
})
