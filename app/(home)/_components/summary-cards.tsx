import { db } from "@/app/_lib/prisma";
import SummaryCard from "./summary-card";
import {
  PiggyBankIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

interface SummaryCards {
  month: string;
}

const SummaryCards = async ({ month }: SummaryCards) => {
  const where = {
    date: {
      gte: new Date(`2024-${month}-01`),
      lte: new Date(`2024-${month}-31`),
    },
  };

  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: {
          amount: true,
        },
      })
    )?._sum?.amount,
  );

  const investimentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTIMENT" },
        _sum: {
          amount: true,
        },
      })
    )?._sum?.amount,
  );

  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: {
          amount: true,
        },
      })
    )?._sum?.amount,
  );

  const balance = depositsTotal - investimentsTotal - expensesTotal;

  return (
    <div className="space-y-6">
      {/* PRIMEIRO CARD */}

      <SummaryCard
        icon={<WalletIcon size={16} />}
        tittle="Saldo"
        amount={balance}
        size="large"
      />

      {/* OUTROS CARD */}
      <div className="grid grid-cols-3 gap-6">
        <SummaryCard
          icon={<PiggyBankIcon size={16} />}
          tittle="Investido"
          amount={investimentsTotal}
        />
        <SummaryCard
          icon={<TrendingUpIcon size={16} className="text-primary" />}
          tittle="Receita"
          amount={depositsTotal}
        />
        <SummaryCard
          icon={<TrendingDownIcon size={16} className="text-red-500" />}
          tittle="Despesas"
          amount={expensesTotal}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
