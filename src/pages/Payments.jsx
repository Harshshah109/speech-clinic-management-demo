import {
  IndianRupee,
  Plus,
  Trash2,
  AlertCircle,
  Wallet,
  Search,
  FileDown
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState
} from 'react'

import * as XLSX from 'xlsx'

import jsPDF from 'jspdf'

import autoTable from 'jspdf-autotable'

import {
  getPayments,
  deletePayment
} from '../services/paymentService'

import {
  getPatients
} from '../services/patientService'

import AddPaymentModal
  from '../components/modals/AddPaymentModal'

export default function Payments() {

  const [payments, setPayments] =
    useState([])

  const [patients, setPatients] =
    useState([])

  const [openModal, setOpenModal] =
    useState(false)

  const [filter, setFilter] =
    useState('monthly')

  const [selectedDate,
    setSelectedDate] =
      useState('')

  const [patientSearch,
    setPatientSearch] =
      useState('')

  useEffect(() => {

    loadData()

  }, [])

  const loadData =
    async () => {

      try {

        const paymentData =
          await getPayments()

        const patientData =
          await getPatients()

        setPayments(
          paymentData || []
        )

        setPatients(
          patientData || []
        )

      } catch (err) {

        console.log(err)
      }
    }

  const filteredPayments =
    useMemo(() => {

      const now =
        new Date()

      return payments.filter((item) => {

        if (!item.date)
          return false

        const matchesPatient =
          (item.patient || '')
            .toLowerCase()
            .includes(
              patientSearch
                .toLowerCase()
                .trim()
            )

        if (!matchesPatient)
          return false

        const paymentDate =
          item.date?.seconds
            ? new Date(
                item.date.seconds * 1000
              )
            : new Date(item.date)

        if (filter === 'weekly') {

          const diff =
            (now - paymentDate) /
            (1000 * 60 * 60 * 24)

          return diff <= 7
        }

        if (filter === 'monthly') {

          return (
            paymentDate.getMonth() ===
              now.getMonth() &&
            paymentDate.getFullYear() ===
              now.getFullYear()
          )
        }

        if (filter === 'yearly') {

          return (
            paymentDate.getFullYear() ===
            now.getFullYear()
          )
        }

        return true
      })

    }, [
      payments,
      filter,
      patientSearch
    ])

  const totalRevenue =
    filteredPayments

      .filter((item) => {

        return (
          item.status === 'Paid' &&
          item.method !== 'From Wallet' &&
          item.paymentType !== 'Pending Payment'
        )
      })

      .reduce(
        (acc, item) =>
          acc + Number(item.amount || 0),
        0
      )

  const totalWalletBalance =
    patients.reduce(
      (acc, patient) =>
        acc + Number(
          patient.walletBalance || 0
        ),
      0
    )

  const pendingRevenue =
    patients.reduce(
      (acc, patient) =>
        acc + Number(
          patient.pendingDue || 0
        ),
      0
    )

  const formatDate =
    (dateObj) => {

      return `${dateObj.getFullYear()}-${
        String(
          dateObj.getMonth() + 1
        ).padStart(2, '0')
      }-${
        String(
          dateObj.getDate()
        ).padStart(2, '0')
      }`
    }

  const today =
    formatDate(new Date())

  const getPaymentDate =
    (item) => {

      if (!item.date)
        return ''

      const paymentDate =
        item.date?.seconds
          ? new Date(
              item.date.seconds * 1000
            )
          : new Date(item.date)

      return formatDate(paymentDate)
    }

  const sortedPayments =
    [...filteredPayments]

      .sort((a, b) => {

        const dateA =
          a.createdAt?.seconds
            ? new Date(
                a.createdAt.seconds * 1000
              )
            : new Date(a.createdAt)

        const dateB =
          b.createdAt?.seconds
            ? new Date(
                b.createdAt.seconds * 1000
              )
            : new Date(b.createdAt)

        return dateB - dateA
      })

  const todayPayments =
    sortedPayments.filter(
      (item) =>
        getPaymentDate(item) === today
    )

  const previousPayments =
    sortedPayments.filter(
      (item) =>
        getPaymentDate(item) !== today
    )

  const selectedDatePayments =
    selectedDate
      ? sortedPayments.filter(
          (item) =>
            getPaymentDate(item) ===
            selectedDate
        )
      : []

  const exportPayments =
    selectedDate
      ? selectedDatePayments
      : sortedPayments

  const exportRows =
    exportPayments.map((item, index) => ({

      No:
        index + 1,

      Patient:
        item.patient || '-',

      PaymentType:
        item.paymentType || 'Payment',

      Amount:
        Number(item.amount || 0),

      Method:
        item.paymentType === 'Pending Payment'
          ? 'No payment method required'
          : item.method || '-',

      Status:
        item.status || '-',

      Date:
        getPaymentDate(item),

      RemainingWallet:
        Number(item.remainingWallet || 0),

      RemainingDue:
        Number(item.remainingDue || 0)
    }))

  const downloadExcel =
    () => {

      const worksheet =
        XLSX.utils.json_to_sheet(
          exportRows
        )

      const workbook =
        XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Payments'
      )

      XLSX.writeFile(
        workbook,
        `payments-${today}.xlsx`
      )
    }

  const downloadPDF =
    () => {

      const doc =
        new jsPDF()

      doc.setFontSize(18)

      doc.text(
        'Payments Report',
        14,
        18
      )

      doc.setFontSize(10)

      doc.text(
        `Generated on: ${today}`,
        14,
        26
      )

      autoTable(doc, {
        startY: 34,
        head: [[
          'No',
          'Patient',
          'Type',
          'Amount',
          'Method',
          'Status',
          'Date',
          'Wallet',
          'Due'
        ]],
        body: exportRows.map((item) => [
          item.No,
          item.Patient,
          item.PaymentType,
          `Rs. ${item.Amount}`,
          item.Method,
          item.Status,
          item.Date,
          `Rs. ${item.RemainingWallet}`,
          `Rs. ${item.RemainingDue}`
        ])
      })

      doc.save(
        `payments-${today}.pdf`
      )
    }

  const PaymentCard =
    ({ item }) => {

      const isPendingPayment =
        item.status === 'Pending' ||
        item.paymentType ===
          'Pending Payment'

      return (

        <div
          className="
            bg-white/75
            border
            border-[#ece7ff]
            rounded-3xl
            p-5
            flex
            flex-col
            gap-5
            backdrop-blur-xl
            shadow-[0_10px_30px_rgba(124,58,237,0.08)]
          "
        >

          <div className="flex flex-col xl:flex-row xl:items-center gap-5">

            <div className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-violet-500
              to-fuchsia-500
              text-white
              flex
              items-center
              justify-center
            ">

              <IndianRupee size={24} />
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3 mb-2">

                <h2 className="text-2xl font-bold text-[#1f1147]">
                  {item.patient}
                </h2>

                <span className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                  ${
                    isPendingPayment
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-cyan-100 text-cyan-700'
                  }
                `}>
                  {
                    isPendingPayment
                      ? 'Pending Payment'
                      : item.paymentType ||
                        'Payment'
                  }
                </span>
              </div>

              <p className="text-[#7c6ca8]">
                {
                  isPendingPayment
                    ? 'No payment method required'
                    : item.method
                } • {
                  item.date?.seconds
                    ? new Date(
                        item.date.seconds * 1000
                      ).toLocaleDateString()
                    : item.date
                }
              </p>
            </div>

            <div>

              <h2 className="text-3xl font-bold text-[#1f1147]">
                ₹{item.amount}
              </h2>
            </div>

            <div>

              {isPendingPayment
                ? (

                  <span className="
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    bg-amber-100
                    text-amber-700
                  ">
                    Pending
                  </span>

                ) : (

                  <span className="
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    bg-emerald-100
                    text-emerald-700
                  ">
                    Paid
                  </span>
                )}
            </div>

            <button
              onClick={async () => {

                const confirmDelete =
                  window.confirm(
                    'Delete payment and rollback balances?'
                  )

                if (!confirmDelete)
                  return

                await deletePayment(
                  item
                )

                loadData()
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
                hover:bg-red-50
                transition-all
              "
            >

              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="
              bg-[#faf8ff]
              rounded-2xl
              p-4
              border
              border-[#ece7ff]
            ">

              <p className="text-[#8c84b3] text-sm mb-2">
                Remaining Wallet
              </p>

              <h3 className="text-2xl font-bold text-cyan-500">
                ₹{
                  item.remainingWallet || 0
                }
              </h3>
            </div>

            <div className="
              bg-[#faf8ff]
              rounded-2xl
              p-4
              border
              border-[#ece7ff]
            ">

              <p className="text-[#8c84b3] text-sm mb-2">
                Remaining Due
              </p>

              <h3 className={`text-2xl font-bold ${
                item.remainingDue > 0
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}>

                {
                  item.remainingDue > 0
                    ? `₹${item.remainingDue}`
                    : 'No Due'
                }
              </h3>
            </div>
          </div>
        </div>
      )
    }

  return (
    <div className="pb-10 text-[#1f1147]">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-5xl font-bold mb-2">
            Payments
          </h1>

          <p className="text-[#7c6ca8] text-lg">
            Advanced clinic billing and settlements
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">

          <button
            onClick={downloadExcel}
            className="
              flex
              items-center
              justify-center
              gap-2
              border
              border-[#ece7ff]
              bg-white/75
              rounded-2xl
              px-5
              py-4
              hover:bg-[#f5f3ff]
              transition-all
              font-semibold
            "
          >
            <FileDown size={18} />
            Excel
          </button>

          <button
            onClick={downloadPDF}
            className="
              flex
              items-center
              justify-center
              gap-2
              border
              border-[#ece7ff]
              bg-white/75
              rounded-2xl
              px-5
              py-4
              hover:bg-[#f5f3ff]
              transition-all
              font-semibold
            "
          >
            <FileDown size={18} />
            PDF
          </button>

          <div className="
            flex
            bg-white/75
            border
            border-[#ece7ff]
            rounded-2xl
            p-1
          ">

            {[
              'weekly',
              'monthly',
              'yearly'
            ].map((item) => (

              <button
                key={item}
                onClick={() =>
                  setFilter(item)
                }
                className={`px-4 h-11 rounded-xl text-sm font-semibold transition-all ${
                  filter === item
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white'
                    : 'text-[#7c6ca8]'
                }`}
              >
                {
                  item.charAt(0)
                    .toUpperCase() +
                  item.slice(1)
                }
              </button>
            ))}
          </div>

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
              font-semibold
            "
          >

            <Plus size={20} />

            <span>
              Add Payment
            </span>
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-3xl
          p-6
        ">

          <div className="
            w-12
            h-12
            rounded-2xl
            bg-violet-100
            flex
            items-center
            justify-center
            mb-5
          ">

            <IndianRupee size={22} />
          </div>

          <h3 className="text-[#7c6ca8] mb-2">
            Total Revenue
          </h3>

          <h2 className="text-4xl font-bold">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-3xl
          p-6
        ">

          <div className="
            w-12
            h-12
            rounded-2xl
            bg-cyan-100
            flex
            items-center
            justify-center
            mb-5
          ">

            <Wallet size={22} />
          </div>

          <h3 className="text-[#7c6ca8] mb-2">
            Wallet Balance
          </h3>

          <h2 className="text-4xl font-bold text-cyan-500">
            ₹{totalWalletBalance}
          </h2>
        </div>

        <div className="
          bg-white/75
          border
          border-[#ece7ff]
          rounded-3xl
          p-6
        ">

          <div className="
            w-12
            h-12
            rounded-2xl
            bg-amber-100
            flex
            items-center
            justify-center
            mb-5
          ">

            <AlertCircle size={22} />
          </div>

          <h3 className="text-[#7c6ca8] mb-2">
            Pending Due
          </h3>

          <h2 className="text-4xl font-bold text-amber-500">
            ₹{pendingRevenue}
          </h2>
        </div>
      </div>

      {/* PATIENT SEARCH + DATE FILTER */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">

        <div className="
          flex
          items-center
          gap-3
          bg-white/80
          border
          border-[#ece7ff]
          rounded-2xl
          px-5
          h-14
          flex-1
        ">

          <Search
            size={20}
            className="text-[#8c84b3]"
          />

          <input
            type="text"
            placeholder="Search patient name..."
            value={patientSearch}
            onChange={(e) =>
              setPatientSearch(
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

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value
            )
          }
          className="
            bg-white/80
            border
            border-[#ece7ff]
            rounded-2xl
            px-5
            h-14
            outline-none
            text-[#1f1147]
          "
          style={{
            colorScheme: 'light'
          }}
        />
      </div>

      {/* PAYMENTS */}
      <div className="space-y-8">

        {selectedDate ? (

          <div>

            <div className="mb-5">

              <h2 className="text-3xl font-bold">
                {new Date(selectedDate)
                  .toLocaleDateString(
                    'en-IN',
                    {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }
                  )}
              </h2>

              <p className="text-[#7c6ca8] mt-1">
                {selectedDatePayments.length} payments
              </p>
            </div>

            <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2">

              {selectedDatePayments.length === 0 && (

                <div className="
                  bg-white/75
                  border
                  border-[#ece7ff]
                  rounded-3xl
                  p-10
                  text-center
                  text-[#8c84b3]
                ">
                  No payments found
                </div>
              )}

              {selectedDatePayments.map((item) => (

                <PaymentCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>

        ) : (

          <>
            <div>

              <div className="mb-5">

                <h2 className="text-3xl font-bold">
                  Today's Payments
                </h2>

                <p className="text-[#7c6ca8] mt-1">
                  {todayPayments.length} payments
                </p>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">

                {todayPayments.length === 0 && (

                  <div className="
                    bg-white/75
                    border
                    border-[#ece7ff]
                    rounded-3xl
                    p-10
                    text-center
                    text-[#8c84b3]
                  ">
                    No payments found
                  </div>
                )}

                {todayPayments.map((item) => (

                  <PaymentCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>

            <div>

              <div className="mb-5">

                <h2 className="text-3xl font-bold">
                  Previous Payments
                </h2>

                <p className="text-[#7c6ca8] mt-1">
                  {previousPayments.length} payments
                </p>
              </div>

              <div className="space-y-4 max-h-[900px] overflow-y-auto pr-2">

                {previousPayments.length === 0 && (

                  <div className="
                    bg-white/75
                    border
                    border-[#ece7ff]
                    rounded-3xl
                    p-10
                    text-center
                    text-[#8c84b3]
                  ">
                    No payments found
                  </div>
                )}

                {previousPayments.map((item) => (

                  <PaymentCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {openModal && (
        <AddPaymentModal
          close={() =>
            setOpenModal(false)
          }
          refresh={loadData}
        />
      )}
    </div>
  )
}