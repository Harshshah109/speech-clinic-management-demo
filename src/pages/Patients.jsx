import {
  Search,
  Plus,
  Phone,
  CalendarDays,
  Pencil,
  Trash2,
  ClipboardPen,
  IndianRupee,
  AlertCircle,
  FileDown,
  X
} from 'lucide-react'

import { useEffect, useState } from 'react'

import * as XLSX from 'xlsx'

import jsPDF from 'jspdf'

import autoTable from 'jspdf-autotable'

import {
  getPatients,
  deletePatient
} from '../services/patientService'

import {
  getPayments
} from '../services/paymentService'

import AddPatientModal
  from '../components/modals/AddPatientModal'

import EditPatientModal
  from '../components/modals/EditPatientModal'

import AddSessionModal
  from '../components/modals/AddSessionModal'

import SessionHistory
  from '../components/patients/SessionHistory'

import PatientAppointmentHistoryModal
  from '../components/modals/PatientAppointmentHistoryModal'

export default function Patients({
  role
}) {

  const [patients, setPatients] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [selectedPatient,
    setSelectedPatient] =
      useState(null)

  const [sessionPatient,
    setSessionPatient] =
      useState(null)

  const [expandedPatient,
    setExpandedPatient] =
      useState(null)

  const [historyPatient,
    setHistoryPatient] =
      useState(null)

  const [paymentReportPatient,
    setPaymentReportPatient] =
      useState(null)

  const [reportFromDate,
    setReportFromDate] =
      useState('')

  const [reportToDate,
    setReportToDate] =
      useState('')

  const [search, setSearch] =
    useState('')

  const [patientFilter,
    setPatientFilter] =
      useState('Active')

  useEffect(() => {

    loadPatients()

  }, [])

  const loadPatients =
    async () => {

      const data =
        await getPatients()

      setPatients(data || [])
    }

  const formatDisplayDate =
    (dateValue) => {

      if (!dateValue)
        return ''

      const date =
        dateValue?.seconds
          ? new Date(dateValue.seconds * 1000)
          : new Date(dateValue)

      return date.toLocaleDateString('en-IN')
    }

  const getPaymentDate =
    (payment) => {

      if (!payment.date)
        return null

      return payment.date?.seconds
        ? new Date(payment.date.seconds * 1000)
        : new Date(payment.date)
    }

  const getPatientPaymentRows =
    async () => {

      const allPayments =
        await getPayments()

      let patientPayments =
        (allPayments || [])
          .filter((payment) =>
            payment.patient === paymentReportPatient.name
          )
          .sort((a, b) =>
            getPaymentDate(a) - getPaymentDate(b)
          )

      if (reportFromDate) {

        const from =
          new Date(reportFromDate)

        patientPayments =
          patientPayments.filter((payment) =>
            getPaymentDate(payment) >= from
          )
      }

      if (reportToDate) {

        const to =
          new Date(reportToDate)

        to.setHours(23, 59, 59, 999)

        patientPayments =
          patientPayments.filter((payment) =>
            getPaymentDate(payment) <= to
          )
      }

      return patientPayments.map((payment, index) => ({

        No:
          index + 1,

        Date:
          formatDisplayDate(payment.date),

        Type:
          payment.paymentType || 'Payment',

        Amount:
          Number(payment.amount || 0),

        Method:
          payment.paymentType === 'Pending Payment'
            ? 'No payment method required'
            : payment.method || '-',

        Status:
          payment.status || '-',

        WalletAfterTransaction:
          Number(payment.remainingWallet || 0),

        PendingAfterTransaction:
          Number(payment.remainingDue || 0)
      }))
    }

  const downloadPatientExcel =
    async () => {

      const rows =
        await getPatientPaymentRows()

      const lastRow =
        rows[rows.length - 1]

      const summary = [
        {
          Patient:
            paymentReportPatient.name,

          FinalWallet:
            lastRow
              ? lastRow.WalletAfterTransaction
              : Number(paymentReportPatient.walletBalance || 0),

          FinalPending:
            lastRow
              ? lastRow.PendingAfterTransaction
              : Number(paymentReportPatient.pendingDue || 0),

          TotalTransactions:
            rows.length
        },
        {}
      ]

      const worksheet =
        XLSX.utils.json_to_sheet([
          ...summary,
          ...rows
        ])

      const workbook =
        XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Payment History'
      )

      XLSX.writeFile(
        workbook,
        `${paymentReportPatient.name}-payment-history.xlsx`
      )
    }

  const downloadPatientPDF =
    async () => {

      const rows =
        await getPatientPaymentRows()

      const lastRow =
        rows[rows.length - 1]

      const finalWallet =
        lastRow
          ? lastRow.WalletAfterTransaction
          : Number(paymentReportPatient.walletBalance || 0)

      const finalPending =
        lastRow
          ? lastRow.PendingAfterTransaction
          : Number(paymentReportPatient.pendingDue || 0)

      const doc =
        new jsPDF()

      doc.setFontSize(18)

      doc.text(
        'Patient Payment History',
        14,
        18
      )

      doc.setFontSize(11)

      doc.text(
        `Patient: ${paymentReportPatient.name}`,
        14,
        28
      )

      doc.text(
        `Final Wallet: Rs. ${finalWallet}`,
        14,
        36
      )

      doc.text(
        `Final Pending Due: Rs. ${finalPending}`,
        14,
        44
      )

      autoTable(doc, {
        startY: 54,
        head: [[
          'No',
          'Date',
          'Type',
          'Amount',
          'Method',
          'Status',
          'Wallet',
          'Pending'
        ]],
        body: rows.map((item) => [
          item.No,
          item.Date,
          item.Type,
          `Rs. ${item.Amount}`,
          item.Method,
          item.Status,
          `Rs. ${item.WalletAfterTransaction}`,
          `Rs. ${item.PendingAfterTransaction}`
        ])
      })

      doc.save(
        `${paymentReportPatient.name}-payment-history.pdf`
      )
    }

  return (

    <div className="pb-10 relative isolate z-0">

      {/* HEADER */}
      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-5xl
            font-bold
            mb-2
            text-[#1f1147]
          ">
            Patients
          </h1>

          <p className="
            text-[#7c6ca8]
            text-lg
          ">
            Manage patient records and sessions
          </p>
        </div>

        {role === 'admin' && (

          <button
            onClick={() =>
              setOpenModal(true)
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              border
              border-[#ece7ff]
              bg-white/75
              rounded-2xl
              px-6
              py-4
              hover:bg-[#f5f3ff]
              transition-all
              text-[#1f1147]
              font-semibold
            "
          >

            <Plus size={20} />

            <span>
              Add Patient
            </span>
          </button>
        )}
      </div>

      {/* FILTER */}
      <div className="
        flex
        flex-wrap
        gap-3
        mb-6
      ">

        {[
          'Active',
          'Assessment',
          'Finished'
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setPatientFilter(item)
            }
            className={`
              h-12
              px-6
              rounded-2xl
              font-semibold
              transition-all
              ${
                patientFilter === item
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white'
                  : 'bg-white/75 border border-[#ece7ff] text-[#1f1147]'
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="
        bg-white/75
        border
        border-[#ece7ff]
        rounded-3xl
        p-4
        mb-6
      ">

        <div className="flex items-center gap-3">

          <Search
            size={20}
            className="text-[#8c84b3]"
          />

          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              bg-transparent
              outline-none
              w-full
              text-[#1f1147]
            "
          />
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-5">

        {patients

          .filter((patient) => {

            const matchesSearch =
              patient.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )

            const matchesCategory =
              (patient.category || 'Assessment') ===
              patientFilter

            return (
              matchesSearch &&
              matchesCategory
            )
          })

          .map((patient) => {

            const totalPendingDue =
              Number(
                patient.pendingDue || 0
              )

            return (

              <div
                key={patient.id}
                className="
                  bg-white/75
                  border
                  border-[#ece7ff]
                  rounded-3xl
                  p-5
                "
              >

                {/* TOP */}
                <div className="
                  flex
                  flex-col
                  xl:flex-row
                  xl:items-center
                  gap-5
                ">

                  {/* AVATAR */}
                  <div className="
                    w-16
                    h-16
                    rounded-full
                    bg-gradient-to-br
                    from-violet-500
                    to-fuchsia-500
                    text-white
                    flex
                    items-center
                    justify-center
                    text-lg
                    font-bold
                  ">
                    {patient.name?.slice(0, 2)}
                  </div>

                  {/* INFO */}
                  <div className="flex-1">

                    <div className="
                      flex
                      items-center
                      gap-3
                      mb-2
                    ">

                      <h2 className="
                        text-2xl
                        font-bold
                      ">
                        {patient.name}
                      </h2>

                      <span className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          patient.category === 'Finished'
                            ? 'bg-zinc-200 text-zinc-700'
                            : patient.category === 'Assessment'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }
                      `}>
                        {patient.category}
                      </span>
                    </div>

                    <p className="
                      text-[#7c6ca8]
                      mb-3
                    ">
                      {patient.condition} • Age {patient.age}
                    </p>

                    <div className="
                      flex
                      flex-wrap
                      gap-4
                      text-sm
                      text-[#7c6ca8]
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">
                        <Phone size={16} />
                        {patient.phone}
                      </div>
                    </div>

                    {/* FINANCE */}
                    {role === 'admin' && (

                      <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4
                        mt-5
                      ">

                        <div className="
                          bg-[#faf8ff]
                          rounded-2xl
                          p-4
                          border
                          border-[#ece7ff]
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                            mb-2
                            text-[#8c84b3]
                            text-sm
                          ">

                            <IndianRupee size={15} />

                            Total Paid
                          </div>

                          <h3 className="
                            text-2xl
                            font-bold
                            text-emerald-500
                          ">
                            ₹{patient.totalPaid || 0}
                          </h3>
                        </div>

                        <div className="
                          bg-[#faf8ff]
                          rounded-2xl
                          p-4
                          border
                          border-[#ece7ff]
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                            mb-2
                            text-[#8c84b3]
                            text-sm
                          ">

                            <IndianRupee size={15} />

                            Wallet Balance
                          </div>

                          <h3 className="
                            text-2xl
                            font-bold
                            text-cyan-500
                          ">
                            ₹{patient.walletBalance || 0}
                          </h3>
                        </div>

                        <div className="
                          bg-[#faf8ff]
                          rounded-2xl
                          p-4
                          border
                          border-[#ece7ff]
                        ">

                          <div className="
                            flex
                            items-center
                            gap-2
                            mb-2
                            text-[#8c84b3]
                            text-sm
                          ">

                            <AlertCircle size={15} />

                            Total Pending Due
                          </div>

                          <h3 className={`
                            text-2xl
                            font-bold
                            ${
                              totalPendingDue > 0
                                ? 'text-yellow-500'
                                : 'text-emerald-500'
                            }
                          `}>
                            {
                              totalPendingDue > 0
                                ? `₹${totalPendingDue}`
                                : 'No Due'
                            }
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3">

                    <button
                      onClick={() => {

                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        })

                        setSessionPatient(patient)
                      }}
                      className="
                        w-12
                        h-12
                        rounded-2xl
                        border
                        border-[#ece7ff]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <ClipboardPen size={18} />
                    </button>

                    {role === 'admin' && (
                      <>
                        <button
                          onClick={() => {

                            window.scrollTo({
                              top: 0,
                              behavior: 'smooth'
                            })

                            setSelectedPatient(patient)
                          }}
                          className="
                            w-12
                            h-12
                            rounded-2xl
                            border
                            border-[#ece7ff]
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={async () => {

                            const confirmDelete =
                              window.confirm(
                                'Delete patient permanently?'
                              )

                            if (!confirmDelete)
                              return

                            await deletePatient(
                              patient.id
                            )

                            loadPatients()
                          }}
                          className="
                            w-12
                            h-12
                            rounded-2xl
                            border
                            border-red-200
                            text-red-500
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* SESSION HISTORY */}
                <button
                  onClick={() =>

                    setExpandedPatient(

                      expandedPatient === patient.id
                        ? null
                        : patient.id
                    )
                  }
                  className="
                    mt-5
                    text-sm
                    text-violet-600
                    font-semibold
                  "
                >
                  {expandedPatient === patient.id
                    ? 'Hide Session History'
                    : 'View Session History'}
                </button>

                {expandedPatient === patient.id && (
                  <SessionHistory
                    patient={patient}
                  />
                )}

                {/* APPOINTMENT HISTORY */}
                <button
                  onClick={() => {

                    setHistoryPatient(patient)

                    setTimeout(() => {

                      const modal =
                        document.getElementById(
                          'patient-appointment-history-modal'
                        )

                      if (modal) {

                        modal.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        })
                      }

                    }, 50)
                  }}
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-violet-600
                    font-semibold
                  "
                >
                  <CalendarDays size={16} />

                  View Appointment History
                </button>

                {role === 'admin' && (
                  <button
                    onClick={() => {

                      setPaymentReportPatient(patient)

                      setReportFromDate('')

                      setReportToDate('')
                    }}
                    className="
                      mt-3
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-violet-600
                      font-semibold
                    "
                  >
                    <FileDown size={16} />

                    Download Payment History
                  </button>
                )}
              </div>
            )
          })}
      </div>

      {/* MODALS */}
      {openModal && (
        <AddPatientModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadPatients}
        />
      )}

      {selectedPatient && (
        <EditPatientModal
          patient={selectedPatient}
          close={() =>
            setSelectedPatient(null)
          }
          refresh={loadPatients}
        />
      )}

      {sessionPatient && (
        <AddSessionModal
          patient={sessionPatient}
          close={() =>
            setSessionPatient(null)
          }
          refresh={loadPatients}
        />
      )}

      {historyPatient && (
        <PatientAppointmentHistoryModal
          patient={historyPatient}
          close={() =>
            setHistoryPatient(null)
          }
        />
      )}

      {paymentReportPatient && (
        <div className="
          fixed
          inset-0
          z-50
          bg-black/40
          backdrop-blur-md
          flex
          items-start
          justify-center
          p-4
          pt-10
        ">

          <div className="
            w-full
            max-w-xl
            bg-white
            rounded-3xl
            p-6
            border
            border-[#ece7ff]
            shadow-[0_10px_40px_rgba(124,58,237,0.18)]
            relative
          ">

            <button
              onClick={() =>
                setPaymentReportPatient(null)
              }
              className="
                absolute
                top-5
                right-5
                w-10
                h-10
                rounded-2xl
                border
                border-[#ece7ff]
                flex
                items-center
                justify-center
              "
            >
              <X size={18} />
            </button>

            <h2 className="
              text-3xl
              font-bold
              text-[#1f1147]
              mb-2
            ">
              Payment History Report
            </h2>

            <p className="
              text-[#7c6ca8]
              mb-6
            ">
              {paymentReportPatient.name}
            </p>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
              mb-6
            ">

              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-semibold
                  mb-2
                  block
                ">
                  From Date
                </label>

                <input
                  type="date"
                  value={reportFromDate}
                  onChange={(e) =>
                    setReportFromDate(e.target.value)
                  }
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    px-4
                    outline-none
                  "
                />
              </div>

              <div>

                <label className="
                  text-sm
                  text-[#7c6ca8]
                  font-semibold
                  mb-2
                  block
                ">
                  To Date
                </label>

                <input
                  type="date"
                  value={reportToDate}
                  onChange={(e) =>
                    setReportToDate(e.target.value)
                  }
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ece7ff]
                    px-4
                    outline-none
                  "
                />
              </div>
            </div>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
              mb-6
            ">

              <div className="
                bg-[#faf8ff]
                rounded-2xl
                p-4
                border
                border-[#ece7ff]
              ">
                <p className="text-sm text-[#8c84b3] mb-1">
                  Current Wallet
                </p>

                <h3 className="text-2xl font-bold text-cyan-500">
                  ₹{paymentReportPatient.walletBalance || 0}
                </h3>
              </div>

              <div className="
                bg-[#faf8ff]
                rounded-2xl
                p-4
                border
                border-[#ece7ff]
              ">
                <p className="text-sm text-[#8c84b3] mb-1">
                  Current Pending
                </p>

                <h3 className="text-2xl font-bold text-yellow-500">
                  ₹{paymentReportPatient.pendingDue || 0}
                </h3>
              </div>
            </div>

            <div className="
              flex
              flex-col
              md:flex-row
              gap-3
            ">

              <button
                onClick={downloadPatientExcel}
                className="
                  flex-1
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-violet-600
                  to-fuchsia-500
                  text-white
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <FileDown size={18} />
                Download Excel
              </button>

              <button
                onClick={downloadPatientPDF}
                className="
                  flex-1
                  h-14
                  rounded-2xl
                  border
                  border-[#ece7ff]
                  bg-white
                  text-[#1f1147]
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <FileDown size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}