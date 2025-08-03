// Deadlock items data organized by category
const deadlockItems = {
    weapon: [
        // Tier I (800)
        { name: "근접전", tier: "I", price: 800, stats: ["+6 총알 방어력", "+14% 총알 저항력", "+6% 총알 흡혈", "+7% 근접 피해량"], description: "근접 전투와 총알 저항력을 향상시킵니다." },
        { name: "확장 탄창", tier: "I", price: 800, stats: ["+26% 탄창 크기", "+15% 재장전 시간"], description: "무기의 탄창 용량을 증가시킵니다." },
        { name: "헤드샷 부스터", tier: "I", price: 800, stats: ["+40% 헤드샷 피해량"], description: "헤드샷 데미지를 대폭 증가시킵니다." },
        { name: "고속탄", tier: "I", price: 800, stats: ["+20% 총알 속도", "+15% 총알 방어력 관통", "+1m 총알 사거리"], description: "총알의 속도와 관통력을 증가시킵니다." },
        { name: "괴수탄", tier: "I", price: 800, stats: ["+30% 크립에게 총알 피해량", "+30% 크립에게 능력 피해량"], description: "크립에게 추가 데미지를 입힙니다." },
        { name: "급속탄", tier: "I", price: 800, stats: ["+13% 화력", "+10% 총알 속도"], description: "화력과 총알 속도를 증가시킵니다." },
        { name: "회복탄", tier: "I", price: 800, stats: ["+8% 총알 흡혈", "영웅 처치 후 체력 +60"], description: "총알 흡혈과 처치 보상을 제공합니다." },
        
        // Tier II (1600)
        { name: "능동 재장전", tier: "II", price: 1600, stats: ["+15% 재장전 속도", "재장전 시 다음 탄창의 첫 번째 총알은 +25% 화력"], description: "능동적인 재장전으로 추가 데미지를 제공합니다." },
        { name: "후방타격", tier: "II", price: 1600, stats: ["+10% 화력", "뒤쪽에서 총알을 맞힌 적은 +35% 총알 피해량"], description: "뒤에서 공격 시 추가 데미지를 입힙니다." },
        { name: "둔화 실탄", tier: "II", price: 1600, stats: ["+1 m/s 이동 속도", "총알 명중 시 적에게 35% 둔화를 2.5초간 적용"], description: "이동 속도를 증가시키고 적을 둔화시킵니다." },
        { name: "강화 탄창", tier: "II", price: 1600, stats: ["+18% 화력", "+15% 재장전 속도", "연속 명중 시 피해량이 누적 증가 (최대 35%)"], description: "연속 명중 시 데미지가 증가합니다." },
        { name: "역학적 돌진", tier: "II", price: 1600, stats: ["+10% 화력", "대시 후 다음 근접 공격이 +70% 피해량"], description: "대시 후 근접 공격을 강화합니다." },
        { name: "장거리", tier: "II", price: 1600, stats: ["+15% 화력", "+10m 총알 사거리"], description: "장거리 전투 능력을 향상시킵니다." },
        { name: "근접 충전", tier: "II", price: 1600, stats: ["+10% 화력", "+7% 근접 피해량", "근접 공격이 전방으로 5m 돌진"], description: "근접 공격 시 돌진 능력을 추가합니다." },
        { name: "신비한 사격", tier: "II", price: 1600, stats: ["+6% 화력", "총알은 영혼력 +0.6당 +1 피해량"], description: "영혼력에 비례해 총알 데미지가 증가합니다." },
        { name: "질주", tier: "II", price: 1600, stats: ["+12% 화력", "+1 m/s 이동 속도"], description: "화력과 이동 속도를 동시에 증가시킵니다." },
        { name: "충격실탄", tier: "II", price: 1600, stats: ["+15% 화력", "총알 명중 시 적에게 35% 둔화를 2.5초간 적용"], description: "총알로 적을 둔화시킵니다." },
        { name: "정신 파쇄탄", tier: "II", price: 1600, stats: ["+6% 화력", "적 명중 시 영혼 저항 -12%를 6초간 적용"], description: "적의 영혼 저항을 감소시킵니다." },
        { name: "탄환 분산", tier: "II", price: 1600, stats: ["탄환이 2갈래로 분산되어 발사됨 (분산된 탄환은 -35% 피해량)"], description: "탄환이 분산되어 여러 목표를 공격합니다." },
        { name: "신속 타격수", tier: "II", price: 1600, stats: ["+6% 화력", "+15% 화력 증가율"], description: "화력 증가율을 향상시킵니다." },
        { name: "거대 탄창", tier: "II", price: 1600, stats: ["+85% 탄창 크기", "-17% 화력 증가율"], description: "탄창 크기를 대폭 증가시키지만 화력 증가율이 감소합니다." },
        { name: "약화 헤드샷", tier: "II", price: 1600, stats: ["+6% 화력", "헤드샷 명중 시 적이 입히는 피해량 -40%를 4초간 적용"], description: "헤드샷으로 적의 공격력을 약화시킵니다." },

        // Tier III (3200)
        { name: "연금술 화염", tier: "III", price: 3200, stats: ["+60 DPS", "3.5초"], description: "적에게 화상 효과를 적용하여 지속 데미지를 입힙니다." },
        { name: "광전사", tier: "III", price: 3200, stats: ["체력이 낮을 때 최대 +70% 화력"], description: "체력이 낮을수록 더 높은 데미지를 입힙니다." },
        { name: "피의 공물", tier: "III", price: 3200, stats: ["처치 시 주변 15m 내 적들에게 125 피해"], description: "영웅 처치 시 주변 적에게 폭발 데미지를 입힙니다." },
        { name: "점사", tier: "III", price: 3200, stats: ["3발 점사 모드", "+6% 화력"], description: "3발을 빠르게 연사하는 점사 모드를 제공합니다." },
        { name: "신속탄", tier: "III", price: 3200, stats: ["+20% 화력 증가율", "+1.5 m/s 이동 속도"], description: "화력 증가율과 이동 속도를 동시에 향상시킵니다." },
        { name: "헤드헌터", tier: "III", price: 3200, stats: ["헤드샷 시 +140 추가 피해", "적을 관통"], description: "헤드샷 시 강력한 추가 데미지와 관통 효과를 제공합니다." },
        { name: "영웅의 오라", tier: "III", price: 3200, stats: ["주변 영웅들에게 +20% 화력"], description: "주변 아군의 화력을 증가시킵니다." },
        { name: "중공탄", tier: "III", price: 3200, stats: ["적을 관통하여 뒤의 적에게 +35% 피해"], description: "총알이 적을 관통하여 연쇄 데미지를 입힙니다." },
        { name: "헌터의 오라", tier: "III", price: 3200, stats: ["주변 영웅들에게 +12 m/s 총알 속도", "+15m 총알 사거리"], description: "주변 아군의 사거리와 총알 속도를 증가시킵니다." },
        { name: "초근접 사격", tier: "III", price: 3200, stats: ["15m 이내에서 +35% 총알 피해량"], description: "근거리에서 치명적인 데미지를 입힙니다." },
        { name: "명중 사격", tier: "III", price: 3200, stats: ["30m 이상에서 +65% 총알 피해량"], description: "장거리 사격 시 추가 데미지를 제공합니다." },
        { name: "영혼 강탈", tier: "III", price: 3200, stats: ["헤드샷 시 능력 쿨다운 -3초"], description: "헤드샷으로 능력 쿨다운을 감소시킵니다." },
        { name: "전류탄", tier: "III", price: 3200, stats: ["총알이 인근 적 2명에게 체인", "체인된 적은 -40% 피해"], description: "전기 충격으로 주변 적들을 연쇄 공격합니다." },
        { name: "독성탄", tier: "III", price: 3200, stats: ["80 DPS", "3초"], description: "중독 효과로 지속 데미지를 입힙니다." },
        { name: "중량탄", tier: "III", price: 3200, stats: ["총알이 적을 뒤로 밀어냄", "+20% 총알 피해량"], description: "무거운 타격으로 적을 뒤로 밀어내며 추가 데미지를 입힙니다." },

        // Tier IV (6400)
        { name: "방어 관통탄", tier: "IV", price: 6400, stats: ["+100% 총알 방어력 관통", "+40% 총알 피해량"], description: "모든 방어력을 관통하는 강력한 탄환입니다." },
        { name: "축전기", tier: "IV", price: 6400, stats: ["5초마다 220 전기 피해", "7m 범위"], description: "일정 시간마다 전기 방전으로 주변을 공격합니다." },
        { name: "무력화 헤드샷", tier: "IV", price: 6400, stats: ["헤드샷 시 4초간 침묵"], description: "헤드샷으로 적을 침묵시킵니다." },
        { name: "분쇄 주먹", tier: "IV", price: 6400, stats: ["근접 공격 시 8m 충격파", "+35% 근접 피해량"], description: "근접 공격 시 강력한 충격파를 생성합니다." },
        { name: "광란", tier: "IV", price: 6400, stats: ["영웅 처치 시 +40% 화력 증가율", "+40% 이동 속도"], description: "영웅 처치 시 공격 속도와 이동 속도가 극대화됩니다." },
        { name: "유리 대포", tier: "IV", price: 6400, stats: ["+70% 총알 피해량", "-15% 총알 저항력", "-15% 영혼 저항력"], description: "최대 데미지를 제공하지만 방어력이 감소합니다." },
        { name: "행운탄", tier: "IV", price: 6400, stats: ["35% 확률로 총알 피해량 +120%"], description: "확률적으로 치명적인 데미지를 입힙니다." }
    ],
    vitality: [
        // Tier I (800)
        { name: "추가 체력", tier: "I", price: 800, stats: ["+125 최대 체력"], description: "최대 체력을 증가시킵니다." },
        { name: "추가 재생", tier: "I", price: 800, stats: ["+2.5 체력 재생"], description: "체력 재생 속도를 증가시킵니다." },
        { name: "추가 활력", tier: "I", price: 800, stats: ["+1 활력", "+15% 활력 재생"], description: "활력과 활력 재생을 증가시킵니다." },
        { name: "치유 의식", tier: "I", price: 800, stats: ["사용 시: 체력을 335 회복하고 11초 동안 +11 체력 재생"], description: "즉시 체력을 회복하고 지속적인 재생 효과를 제공합니다." },
        { name: "근거리 치유", tier: "I", price: 800, stats: ["+12% 근접 피해량", "+24% 근접 치유"], description: "근접 공격 시 체력을 회복합니다." },
        { name: "반격", tier: "I", price: 800, stats: ["+75 최대 체력", "적이 근접 공격을 할 때 40의 피해를 입음"], description: "근접 공격을 받을 때 반격 데미지를 입힙니다." },
        { name: "쾌속 장화", tier: "I", price: 800, stats: ["+1 m/s 이동 속도", "+75 최대 체력"], description: "이동 속도와 체력을 동시에 증가시킵니다." },

        // Tier II (1600)
        { name: "대피소", tier: "II", price: 1600, stats: ["+175 최대 체력", "+3 체력 재생", "+15% 총알 저항력"], description: "체력, 재생력, 총알 저항력을 동시에 향상시킵니다." },
        { name: "총알 흡혈", tier: "II", price: 1600, stats: ["+8% 총알 흡혈", "+75 최대 체력"], description: "총알 공격으로 체력을 회복합니다." },
        { name: "디버프 감소기", tier: "II", price: 1600, stats: ["+125 최대 체력", "+3 체력 재생", "-30% 디버프 지속시간"], description: "디버프의 지속시간을 감소시킵니다." },
        { name: "신령 장교", tier: "II", price: 1600, stats: ["+125 최대 체력", "+8 영혼력", "+2.5 체력 재생", "+0.3 영혼력 재생"], description: "체력과 영혼력을 동시에 향상시킵니다." },
        { name: "지구력", tier: "II", price: 1600, stats: ["+125 최대 체력", "+1.5 m/s 이동 속도", "+25% 활력 재생"], description: "지구력과 이동 능력을 향상시킵니다." },
        { name: "치유 감쇠", tier: "II", price: 1600, stats: ["+125 최대 체력", "+8% 총알 흡혈", "적 명중 시 -65% 치유 효율을 6초간 적용"], description: "적의 치유 능력을 감소시킵니다." },
        { name: "치유 부스터", tier: "II", price: 1600, stats: ["+125 최대 체력", "+30% 치유 효율", "+15% 체력 재생"], description: "모든 치유 효과를 강화합니다." },
        { name: "향상된 활력", tier: "II", price: 1600, stats: ["+125 최대 체력", "+2 활력", "+25% 활력 재생", "+2 m/s 슬라이드 거리"], description: "활력과 이동성을 크게 향상시킵니다." },
        { name: "리턴 파이어", tier: "II", price: 1600, stats: ["+125 최대 체력", "+8% 총알 흡혈", "당신을 공격한 적들은 반사 피해량을 받음"], description: "공격받을 때 반사 데미지를 입힙니다." },
        { name: "정신 흡혈", tier: "II", price: 1600, stats: ["+125 최대 체력", "+8 영혼력", "+8% 정신 흡혈"], description: "영혼력 기반 공격으로 체력을 회복합니다." },
        { name: "혈투 흉갑", tier: "II", price: 1600, stats: ["+11 총알 방어력", "+11 영혼 저항력", "+2.5 체력 재생"], description: "총알과 영혼 공격에 대한 방어력을 제공합니다." },

        // Tier III (3200)
        { name: "총알 저항", tier: "III", price: 3200, stats: ["+20 총알 방어력", "+250 최대 체력", "+20% 총알 저항력"], description: "총알 공격에 대한 강력한 저항력을 제공합니다." },
        { name: "사기 진작", tier: "III", price: 3200, stats: ["+250 최대 체력", "+3 m/s 이동 속도", "+50% 슬라이드 거리", "사용 시: 주변 팀원들에게 이동 속도 버프"], description: "팀 전체의 이동성을 향상시킵니다." },
        { name: "디버프 제거", tier: "III", price: 3200, stats: ["+250 최대 체력", "+5 체력 재생", "사용 시: 모든 디버프 제거 및 면역 (3초)"], description: "모든 디버프를 제거하고 일시적으로 면역을 제공합니다." },
        { name: "불굴", tier: "III", price: 3200, stats: ["+425 최대 체력", "+14 영혼 저항력", "+20% 디버프 저항력"], description: "강력한 체력과 디버프 저항력을 제공합니다." },
        { name: "생명력 타격", tier: "III", price: 3200, stats: ["+250 최대 체력", "+12% 총알 흡혈", "+12% 정신 흡혈", "처치 시 체력 100% 회복"], description: "영웅 처치 시 완전히 회복됩니다." },
        { name: "장엄한 도약", tier: "III", price: 3200, stats: ["+250 최대 체력", "+1 m/s 이동 속도", "사용 시: 높이 점프, 착지 시 피해 및 둔화"], description: "강력한 점프 공격 능력을 제공합니다." },
        { name: "금속 피부", tier: "III", price: 3200, stats: ["+250 최대 체력", "+8 체력 재생", "사용 시: 4초간 완전 면역 (60초 쿨다운)"], description: "일정 시간 동안 모든 데미지에 완전 면역됩니다." },
        { name: "구조 광선", tier: "III", price: 3200, stats: ["+200 최대 체력", "+15 영혼력", "아군 대상 사용: 즉시 이동시키고 250 체력 회복"], description: "위험한 아군을 즉시 구조합니다." },
        { name: "정신 저항", tier: "III", price: 3200, stats: ["+20 영혼 저항력", "+250 최대 체력", "+20% 영혼 저항력"], description: "영혼 공격에 대한 강력한 저항력을 제공합니다." },
        { name: "우월한 활력", tier: "III", price: 3200, stats: ["+250 최대 체력", "+4 활력", "+100% 활력 재생", "+4 m/s 슬라이드 거리", "+25% 대시 거리"], description: "활력과 이동성을 극대화합니다." },
        { name: "워프 스톤", tier: "III", price: 3200, stats: ["+200 최대 체력", "+4 체력 재생", "사용 시: 즉시 순간이동 (23초 쿨다운)"], description: "즉시 순간이동으로 위험에서 벗어납니다." },

        // Tier IV (6400)
        { name: "거신", tier: "IV", price: 6400, stats: ["+1000 최대 체력", "+20% 총알 저항력", "+20% 영혼 저항력", "+4 m/s 이동 속도", "사용 시: 거대화 (18초간)"], description: "거대한 체력과 방어력을 제공하며 거대화 능력을 사용할 수 있습니다." },
        { name: "저거너트", tier: "IV", price: 6400, stats: ["+500 최대 체력", "+40% 총알 저항력", "+40% 영혼 저항력", "사용 시: 14초간 둔화 면역 및 이동 속도 증가"], description: "강력한 방어력과 기동성을 제공합니다." },
        { name: "거머리", tier: "IV", price: 6400, stats: ["+350 최대 체력", "+35% 총알 흡혈", "+35% 정신 흡혈", "주변 아군도 흡혈 효과 공유"], description: "강력한 흡혈 능력을 팀과 공유합니다." },
        { name: "팬텀 스트라이크", tier: "IV", price: 6400, stats: ["+300 최대 체력", "+15 영혼력", "사용 시: 적에게 순간이동하여 침묵 및 피해 (35초)"], description: "적에게 순간이동하여 강력한 공격을 가합니다." },
        { name: "저지불가", tier: "IV", price: 6400, stats: ["+400 최대 체력", "+8 체력 재생", "사용 시: 6초간 디버프 면역 및 둔화 면역"], description: "모든 방해 효과에 면역이 되어 저지할 수 없게 됩니다." }
    ],
    spirit: [
        // Tier I (800)
        { name: "추가 충전", tier: "I", price: 800, stats: ["+1 능력 충전"], description: "능력 사용 횟수를 증가시킵니다." },
        { name: "추가 영혼력", tier: "I", price: 800, stats: ["+6 영혼력"], description: "영혼력을 증가시킵니다." },
        { name: "신비한 폭발", tier: "I", price: 800, stats: ["+4 영혼력", "능력 적중 시 주변에 65 정신 피해"], description: "능력 사용 시 주변에 폭발 데미지를 입힙니다." },
        { name: "신비한 사거리", tier: "I", price: 800, stats: ["+4 영혼력", "+15% 능력 사거리"], description: "능력 사거리를 증가시킵니다." },
        { name: "신비한 취약점", tier: "I", price: 800, stats: ["+4 영혼력", "능력 적중 시 -15% 영혼 저항력을 7초간 적용"], description: "적의 영혼 저항력을 감소시킵니다." },
        { name: "정신 강타", tier: "I", price: 800, stats: ["+4 영혼력", "근접 공격이 +32 정신 피해"], description: "근접 공격에 정신 데미지를 추가합니다." },

        // Tier II (1600)
        { name: "비전 쇄도", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "능력 사용 시 +3 m/s 이동 속도 (4초)"], description: "능력 사용 시 이동 속도가 증가합니다." },
        { name: "총알 저항 파쇄기", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "능력 적중 시 -24% 총알 저항력을 6초간 적용"], description: "적의 총알 저항력을 감소시킵니다." },
        { name: "한랭 전선", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "능력 적중 시 40% 둔화를 3초간 적용"], description: "능력으로 적을 둔화시킵니다." },
        { name: "개선된 재사용 대기시간", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "-12% 능력 재사용 대기시간"], description: "능력 쿨다운을 감소시킵니다." },
        { name: "지속시간 연장기", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "+25% 능력 지속시간"], description: "능력 효과 지속시간을 증가시킵니다." },
        { name: "개선된 영혼력", tier: "II", price: 1600, stats: ["+12 영혼력", "+75 최대 체력"], description: "영혼력을 크게 증가시킵니다." },
        { name: "신비한 둔화", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "능력 적중 시 35% 둔화를 2.5초간 적용"], description: "능력으로 적을 둔화시킵니다." },
        { name: "신속 재장전", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "능력 사용 시 즉시 재장전"], description: "능력 사용 시 즉시 재장전됩니다." },
        { name: "둔화 저주", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "사용 시: 적에게 -3 m/s 이동 속도 (3초)"], description: "적의 이동 속도를 감소시킵니다." },
        { name: "억제기", tier: "II", price: 1600, stats: ["+8 영혼력", "+75 최대 체력", "능력 적중 시 -30% 화력을 5초간 적용"], description: "적의 공격력을 감소시킵니다." },

        // Tier III (3200)
        { name: "부패", tier: "III", price: 3200, stats: ["+16 영혼력", "+150 최대 체력", "능력 적중 시 적에게 DPS 지속 피해 (6초)"], description: "능력으로 지속 데미지를 입힙니다." },
        { name: "무장 해제 저주", tier: "III", price: 3200, stats: ["+16 영혼력", "+150 최대 체력", "사용 시: 적 무장해제 및 침묵 (3.5초)"], description: "적을 무력화시키고 침묵시킵니다." },
        { name: "마법 범위 확장", tier: "III", price: 3200, stats: ["+16 영혼력", "+150 최대 체력", "+40% 능력 범위"], description: "능력 범위를 크게 증가시킵니다." },
        { name: "넉다운", tier: "III", price: 3200, stats: ["+16 영혼력", "+150 최대 체력", "능력 적중 시 적을 기절시킴 (0.8초)"], description: "능력으로 적을 기절시킵니다." },
        { name: "신속 재충전", tier: "III", price: 3200, stats: ["+16 영혼력", "+150 최대 체력", "-35% 능력 재사용 대기시간"], description: "능력 쿨다운을 대폭 감소시킵니다." },
        { name: "침묵 문양", tier: "III", price: 3200, stats: ["+16 영혼력", "+150 최대 체력", "사용 시: 범위 침묵 (3초)"], description: "범위 내 적들을 침묵시킵니다." },
        { name: "우월한 재사용 대기시간", tier: "III", price: 3200, stats: ["+20 영혼력", "+150 최대 체력", "-45% 능력 재사용 대기시간"], description: "능력 쿨다운을 극대화합니다." },
        { name: "우월한 지속시간", tier: "III", price: 3200, stats: ["+20 영혼력", "+150 최대 체력", "+50% 능력 지속시간"], description: "능력 지속시간을 극대화합니다." },
        { name: "힘의 쇄도", tier: "III", price: 3200, stats: ["+20 영혼력", "+150 최대 체력", "능력 사용 시 +40 영혼력 (6초)"], description: "능력 사용 시 일시적으로 영혼력이 크게 증가합니다." },
        { name: "고통의 파동", tier: "III", price: 3200, stats: ["+20 영혼력", "+150 최대 체력", "주변 적에게 DPS 정신 피해 (지속적)"], description: "주변 적들에게 지속적인 정신 데미지를 입힙니다." },

        // Tier IV (6400)
        { name: "무한한 영혼력", tier: "IV", price: 6400, stats: ["+40 영혼력", "+300 최대 체력", "-60% 능력 재사용 대기시간"], description: "영혼력과 쿨다운 감소를 극대화합니다." },
        { name: "저주", tier: "IV", price: 6400, stats: ["+30 영혼력", "+200 최대 체력", "사용 시: 적에게 침묵, 무력화, 둔화 (3.5초)"], description: "강력한 저주로 적을 완전히 무력화시킵니다." },
        { name: "메아리 파편", tier: "IV", price: 6400, stats: ["+25 영혼력", "+200 최대 체력", "사용 시: 정신 능력 2배 시전 (25초)"], description: "정신 능력을 두 번 시전합니다." },
        { name: "확대되는 노출", tier: "IV", price: 6400, stats: ["+25 영혼력", "+200 최대 체력", "적 명중 시 지속적 데미지 증가 (누적)"], description: "적을 공격할 때마다 데미지가 누적됩니다." },
        { name: "이더리얼 시프트", tier: "IV", price: 6400, stats: ["+25 영혼력", "+200 최대 체력", "사용 시: 무적 상태 (3초)"], description: "일시적으로 무적 상태가 됩니다." },
        { name: "신비한 잔향", tier: "IV", price: 6400, stats: ["+35 영혼력", "+200 최대 체력", "+50% 정신 피해", "능력이 근처 적에게 전파"], description: "능력이 근처 적들에게 연쇄 반응을 일으킵니다." },
        { name: "리프레셔", tier: "IV", price: 6400, stats: ["+20 영혼력", "+200 최대 체력", "사용 시: 모든 능력 즉시 재충전"], description: "모든 능력을 즉시 재사용할 수 있게 합니다." }
    ]
};

module.exports = deadlockItems;