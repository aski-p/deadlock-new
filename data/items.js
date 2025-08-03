// Deadlock items data organized by category
const deadlockItems = {
    weapon: [
        { name: "근접전", tier: "I", price: 800, stats: ["+3% 공격 속도"], description: "근접 무기의 공격 속도를 증가시킵니다." },
        { name: "확장 탄창", tier: "I", price: 800, stats: ["+15% 탄창 크기"], description: "무기의 탄창 용량을 증가시킵니다." },
        { name: "헤드샷 부스터", tier: "I", price: 800, stats: ["+10% 헤드샷 데미지"], description: "헤드샷 데미지를 증가시킵니다." },
        { name: "고속탄", tier: "I", price: 800, stats: ["+20% 총알 속도"], description: "총알의 속도를 증가시킵니다." },
        { name: "괴수탄", tier: "I", price: 800, stats: ["+30% 총알 데미지"], description: "총알 데미지를 증가시킵니다." },
        { name: "급속탄", tier: "I", price: 800, stats: ["+25% 화력"], description: "화력을 증가시킵니다." },
        { name: "회복탄", tier: "I", price: 800, stats: ["+체력 회복"], description: "적 처치 시 체력을 회복합니다." },
        { name: "급속 재장전", tier: "II", price: 1600, stats: ["+40% 재장전 속도"], description: "재장전 속도를 대폭 향상시킵니다." },
        { name: "후방 기습", tier: "II", price: 1600, stats: ["+35% 백어택 데미지"], description: "뒤에서 공격 시 추가 데미지를 입힙니다." },
        { name: "민첩 걸음", tier: "II", price: 1600, stats: ["+2m/s 이동 속도"], description: "이동 속도를 증가시킵니다." },
        { name: "강화 탄창", tier: "II", price: 1600, stats: ["+30% 탄창 크기"], description: "탄창 크기를 크게 증가시킵니다." },
        { name: "반응성 대시", tier: "II", price: 1600, stats: ["대시 거리 +3m"], description: "대시 거리를 증가시킵니다." },
        { name: "장거리 사격", tier: "II", price: 1600, stats: ["+15% 사거리"], description: "무기의 사거리를 증가시킵니다." },
        { name: "근거리 돌격", tier: "II", price: 1600, stats: ["+40% 근거리 데미지"], description: "근거리에서 추가 데미지를 입힙니다." },
        { name: "신비탄", tier: "II", price: 1600, stats: ["+영혼 데미지"], description: "총알에 영혼 데미지를 추가합니다." },
        { name: "개방탄", tier: "II", price: 1600, stats: ["+관통력"], description: "총알이 적을 관통합니다." },
        { name: "둔화탄", tier: "II", price: 1600, stats: ["+둔화 효과"], description: "적중 시 적을 둔화시킵니다." },
        { name: "마법 분쇄탄", tier: "II", price: 1600, stats: ["+영혼 저항 감소"], description: "적의 영혼 저항을 감소시킵니다." },
        { name: "분할탄", tier: "II", price: 1600, stats: ["+분할 효과"], description: "총알이 분할되어 추가 타겟을 공격합니다." },
        { name: "고속 연사", tier: "II", price: 1600, stats: ["+25% 연사속도"], description: "연사 속도를 증가시킵니다." },
        { name: "대형 탄창", tier: "II", price: 1600, stats: ["+50% 탄창 크기"], description: "탄창 크기를 대폭 증가시킵니다." },
        { name: "감쇠 헤드샷", tier: "II", price: 1600, stats: ["+35% 헤드샷 데미지"], description: "헤드샷 데미지를 크게 증가시킵니다." },
        { name: "화염 연금술", tier: "III", price: 3200, stats: ["+화염 데미지"], description: "공격에 화염 효과를 추가합니다." },
        { name: "광전사", tier: "III", price: 3200, stats: ["+체력 비례 데미지"], description: "체력이 낮을수록 더 큰 데미지를 입힙니다." },
        { name: "피의 공물", tier: "III", price: 3200, stats: ["+생명력 흡수"], description: "적 처치 시 체력을 흡수합니다." },
        { name: "급속 사격", tier: "III", price: 3200, stats: ["+40% 연사속도"], description: "연사 속도를 대폭 증가시킵니다." },
        { name: "희생 제물", tier: "III", price: 3200, stats: ["+궁극기 가속"], description: "적 처치 시 궁극기 쿨타임을 감소시킵니다." },
        { name: "저항 증대", tier: "III", price: 3200, stats: ["+25% 저항력"], description: "모든 저항력을 증가시킵니다." }
    ],
    vitality: [
        { name: "추가 체력", tier: "I", price: 800, stats: ["+150 체력"], description: "최대 체력을 증가시킵니다." },
        { name: "추가 재생", tier: "I", price: 800, stats: ["+2 체력 재생/초"], description: "체력 재생 속도를 증가시킵니다." },
        { name: "추가 활력", tier: "I", price: 800, stats: ["+30% 체력 재생"], description: "체력 재생률을 증가시킵니다." },
        { name: "방탄복", tier: "I", price: 800, stats: ["+20% 총알 저항"], description: "총알 데미지에 대한 저항력을 증가시킵니다." },
        { name: "치유 붕대", tier: "I", price: 800, stats: ["+치유 아이템"], description: "즉시 체력을 회복하는 아이템을 제공합니다." },
        { name: "치유 권총", tier: "I", price: 800, stats: ["+치유 능력"], description: "자신과 아군을 치유할 수 있습니다." },
        { name: "격화", tier: "II", price: 1600, stats: ["+이동 속도"], description: "체력이 낮을 때 이동 속도가 증가합니다." },
        { name: "회복 샷", tier: "II", price: 1600, stats: ["+즉시 치유"], description: "즉시 체력을 대량 회복합니다." },
        { name: "메딕 큐브", tier: "II", price: 1600, stats: ["+치유 증폭"], description: "모든 치유 효과를 증폭시킵니다." },
        { name: "헤비 아머", tier: "III", price: 3200, stats: ["+40% 물리 저항"], description: "물리 데미지에 대한 저항력을 크게 증가시킵니다." },
        { name: "저항의 갑옷", tier: "III", price: 3200, stats: ["+30% 마법 저항"], description: "마법 데미지에 대한 저항력을 증가시킵니다." },
        { name: "생명력 증대", tier: "IV", price: 6400, stats: ["+500 체력", "+5 체력 재생/초"], description: "체력과 재생력을 크게 증가시킵니다." }
    ],
    spirit: [
        { name: "추가 충전", tier: "I", price: 800, stats: ["+1 능력 충전"], description: "능력 사용 횟수를 증가시킵니다." },
        { name: "추가 마법", tier: "I", price: 800, stats: ["+20 정신력"], description: "정신력을 증가시킵니다." },
        { name: "신비의 폭발", tier: "I", price: 800, stats: ["+15% 능력 데미지"], description: "능력 데미지를 증가시킵니다." },
        { name: "신비 용사", tier: "I", price: 800, stats: ["+능력 흡수"], description: "능력 사용 시 체력을 회복합니다." },
        { name: "정신 공진", tier: "I", price: 800, stats: ["+정신력 재생"], description: "정신력 재생 속도를 증가시킵니다." },
        { name: "마법 실드", tier: "II", price: 1600, stats: ["+능력 저항"], description: "능력 데미지에 대한 저항력을 증가시킵니다." },
        { name: "영혼 폭발", tier: "II", price: 1600, stats: ["+범위 능력 데미지"], description: "범위 능력의 데미지를 증가시킵니다." },
        { name: "정신 재생", tier: "II", price: 1600, stats: ["+정신력 회복"], description: "정신력 회복 속도를 증가시킵니다." },
        { name: "마법 강화", tier: "III", price: 3200, stats: ["+30% 능력 데미지", "+20% 재사용 대기시간 감소"], description: "능력을 전반적으로 강화합니다." },
        { name: "무한 정신", tier: "IV", price: 6400, stats: ["+50 정신력", "+3 능력 충전"], description: "정신력과 능력 사용 횟수를 크게 증가시킵니다." }
    ]
};

module.exports = deadlockItems;