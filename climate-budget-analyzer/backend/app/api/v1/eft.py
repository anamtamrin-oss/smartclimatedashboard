from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.schemas import EFTCalculationInput, EFTCalculationResult

router = APIRouter(prefix="/eft", tags=["EFT Calculator"])


@router.post("/calculate", response_model=EFTCalculationResult)
def calculate_eft(data: EFTCalculationInput):
    # Calculate ICKE
    icke = (
        (data.ika * 0.30) +
        (data.iku * 0.25) +
        (data.hutan * 0.30) +
        (data.sampah * 0.15)
    )
    
    # Calculate TAPE and TAKE
    tape = icke * 150_000_000
    take = icke * 80_000_000
    
    # Generate recommendations based on lowest score
    scores = {
        "Indeks Kualitas Air (IKA)": data.ika,
        "Indeks Kualitas Udara (IKU)": data.iku,
        "Tutupan Hutan": data.hutan,
        "Pengelolaan Sampah": data.sampah
    }
    
    min_indicator = min(scores, key=scores.get)
    min_score = scores[min_indicator]
    
    recommendations = []
    
    if min_score < 50:
        recommendations.append(f"Prioritaskan peningkatan {min_indicator} - skor saat ini sangat rendah ({min_score:.1f})")
    
    if data.ika < 60:
        recommendations.append("Tingkatkan kualitas air melalui program sanitasi dan pengolahan limbah")
    
    if data.iku < 60:
        recommendations.append("Perbaiki kualitas udara dengan pengendalian emisi dan ruang terbuka hijau")
    
    if data.hutan < 60:
        recommendations.append("Intensifikasi program reboisasi dan perlindungan hutan")
    
    if data.sampah < 60:
        recommendations.append("Optimalkan sistem pengelolaan sampah dan daur ulang")
    
    if not recommendations:
        recommendations.append("Pertahankan kinerja lingkungan yang baik di semua indikator")
    
    return EFTCalculationResult(
        icke=icke,
        tape=tape,
        take=take,
        recommendations=recommendations
    )


@router.get("/recommendations")
def get_recommendations():
    return {
        "general": [
            "Fokus pada indikator dengan skor terendah untuk memaksimalkan ICKE",
            "Koordinasi lintas OPD untuk program lingkungan terintegrasi",
            "Manfaatkan insentif EFT untuk pendanaan kegiatan iklim"
        ],
        "specific": {
            "IKA": [
                "Program pembangunan IPAL komunal",
                "Pengendalian pencemaran sungai",
                "Monitoring kualitas air berkala"
            ],
            "IKU": [
                "Pengembangan transportasi ramah lingkungan",
                "Penambahan RTH kota",
                "Pengendalian debu konstruksi"
            ],
            "hutan": [
                "Reboisasi lahan kritis",
                "Pencegahan deforestasi",
                "Pengembangan hutan kemasyarakatan"
            ],
            "sampah": [
                "Pengembangan TPST",
                "Program bank sampah",
                "Pengurangan plastik sekali pakai"
            ]
        }
    }
