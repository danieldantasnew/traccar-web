export default function accuracy(accuracy) {
  if (accuracy > 0 && accuracy <= 10) return "Alta";
  else if (accuracy > 10 && accuracy <= 50) return "Média";
  else if (accuracy > 50) return "Baixa";
  else return "Sem informação";
}
