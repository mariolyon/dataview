-- CreateTable
CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "date_testing" TIMESTAMP(3) NOT NULL,
    "date_birthdate" TIMESTAMP(3) NOT NULL,
    "gender" INTEGER NOT NULL,
    "ethnicity" INTEGER NOT NULL,
    "creatine" DECIMAL(65,30) NOT NULL,
    "chloride" DECIMAL(65,30) NOT NULL,
    "fasting_glucose" DECIMAL(65,30) NOT NULL,
    "potassium" DECIMAL(65,30) NOT NULL,
    "sodium" DECIMAL(65,30) NOT NULL,
    "total_calcium" DECIMAL(65,30) NOT NULL,
    "total_protein" DECIMAL(65,30) NOT NULL,
    "creatine_unit" TEXT NOT NULL,
    "chloride_unit" TEXT NOT NULL,
    "fasting_glucose_unit" TEXT NOT NULL,
    "potassium_unit" TEXT NOT NULL,
    "sodium_unit" TEXT NOT NULL,
    "total_calcium_unit" TEXT NOT NULL,
    "total_protein_unit" TEXT NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);
