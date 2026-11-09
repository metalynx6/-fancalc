/**
 * ماشین حساب فانتزی و کیوت با پشتیبانی کامل از اعداد کسری
 * Cute Fantasy Fraction Calculator
 */

// --- کلاس محاسبات دقیق کسرها (Fraction Math Engine) ---
class Fraction {
  constructor(numerator, denominator = 1n) {
    let n = BigInt(numerator);
    let d = BigInt(denominator);

    if (d === 0n) {
      throw new Error("Division by zero");
    }

    if (d < 0n) {
      n = -n;
      d = -d;
    }

    const common = Fraction.gcd(n, d);
    this.n = n / common;
    this.d = d / common;
  }

  static gcd(a, b) {
    let x = a < 0n ? -a : a;
    let y = b < 0n ? -b : b;
    while (y !== 0n) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x === 0n ? 1n : x;
  }

  static parse(val) {
    if (val instanceof Fraction) return val;
    val = String(val).trim();

    if (!val || val === '0') return new Fraction(0n, 1n);

    let isNeg = false;
    if (val.startsWith('-')) {
      isNeg = true;
      val = val.substring(1).trim();
    }

    // کسر مخلوط مثل "1 1/2" یا "2_3/4"
    if (val.includes(' ') || val.includes('_')) {
      const parts = val.split(/[ _]+/);
      if (parts.length === 2 && parts[1].includes('/')) {
        const whole = BigInt(parts[0]);
        const frac = Fraction.parse(parts[1]);
        const totalN = whole * frac.d + frac.n;
        const res = new Fraction(totalN, frac.d);
        return isNeg ? res.negate() : res;
      }
    }

    // کسر ساده مثل "3/4"
    if (val.includes('/')) {
      const parts = val.split('/');
      let numPart = parts[0].trim();
      let denPart = parts[1].trim();

      if (!denPart) {
        // اگر هنوز مخرج تایپ نشده، فرض ۱ است
        denPart = '1';
      }

      if (numPart.includes('.') || denPart.includes('.')) {
        const fn = Fraction.fromDecimal(numPart);
        const fd = Fraction.fromDecimal(denPart);
        const res = fn.div(fd);
        return isNeg ? res.negate() : res;
      }

      const res = new Fraction(BigInt(numPart || '0'), BigInt(denPart));
      return isNeg ? res.negate() : res;
    }

    // اعشاری مثل "0.75"
    if (val.includes('.')) {
      const res = Fraction.fromDecimal(val);
      return isNeg ? res.negate() : res;
    }

    // عدد صحیح
    const res = new Fraction(BigInt(val), 1n);
    return isNeg ? res.negate() : res;
  }

  static fromDecimal(str) {
    str = String(str).trim();
    let isNeg = false;
    if (str.startsWith('-')) {
      isNeg = true;
      str = str.substring(1).trim();
    }
    const parts = str.split('.');
    const intPart = parts[0] || '0';
    const decPart = parts[1] || '';
    const den = 10n ** BigInt(decPart.length);
    const num = BigInt(intPart) * den + BigInt(decPart || '0');
    const res = new Fraction(num, den);
    return isNeg ? res.negate() : res;
  }

  add(other) {
    const f = Fraction.parse(other);
    return new Fraction(this.n * f.d + f.n * this.d, this.d * f.d);
  }

  sub(other) {
    const f = Fraction.parse(other);
    return new Fraction(this.n * f.d - f.n * this.d, this.d * f.d);
  }

  mul(other) {
    const f = Fraction.parse(other);
    return new Fraction(this.n * f.n, this.d * f.d);
  }

  div(other) {
    const f = Fraction.parse(other);
    if (f.n === 0n) throw new Error("Division by zero");
    return new Fraction(this.n * f.d, this.d * f.n);
  }

  negate() {
    return new Fraction(-this.n, this.d);
  }

  isZero() {
    return this.n === 0n;
  }

  isInteger() {
    return this.d === 1n;
  }

  // نمایش کسری ساده: مثل 3/4 یا 5/2
  toFractionString() {
    if (this.d === 1n) return this.n.toString();
    return `${this.n}/${this.d}`;
  }

  // نمایش کسر مخلوط: مثل 2 1/2
  toMixedString() {
    if (this.d === 1n) return this.n.toString();
    const absN = this.n < 0n ? -this.n : this.n;
    const whole = absN / this.d;
    const rem = absN % this.d;
    if (whole === 0n) return `${this.n}/${this.d}`;
    const sign = this.n < 0n ? '-' : '';
    return `${sign}${whole} ${rem}/${this.d}`;
  }

  // نمایش اعشاری
  toDecimalString(maxDigits = 6) {
    const num = Number(this.n);
    const den = Number(this.d);
    const val = num / den;
    const factor = 10 ** maxDigits;
    const rounded = Math.round((val + Number.EPSILON) * factor) / factor;
    return rounded.toString();
  }
}

// --- Audio Synthesizer (بدون نیاز به فایل صوتی خارجی) ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // صدای تق‌تق حبابی کیوت برای دکمه‌ها
  playPop(freq = 480) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // آکورد خوشحالی و جادویی برای مساوی (=)
  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

      const startTime = this.ctx.currentTime + i * 0.05;
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // صدای خطا / بم
  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

const sounds = new SoundEffects();

// --- فرمت‌بندی نمایش کسرها با چیدمان ریاضی فانتزی ---
function renderFractionHTML(valStr) {
  if (!valStr) return '0';
  if (valStr === 'خطا! (0÷)') {
    return '<span style="color:#ef4444;font-size:1.5rem">خطا! (0÷)</span>';
  }

  // حالت تایپ در حال انتظار مخرج: مثلا "3/"
  if (valStr.endsWith('/')) {
    const num = valStr.slice(0, -1);
    const isNeg = num.startsWith('-');
    const cleanNum = isNeg ? num.substring(1) : num;
    return `
      ${isNeg ? '<span class="f-sign">−</span>' : ''}
      <span class="frac-box">
        <span class="f-num">${cleanNum || '0'}</span>
        <span class="f-den placeholder">؟</span>
      </span>
    `;
  }

  // کسر مخلوط: مثلا "2 1/3"
  if (valStr.includes(' ') && valStr.includes('/')) {
    const [whole, frac] = valStr.split(' ');
    const [num, den] = frac.split('/');
    const isNeg = whole.startsWith('-');
    const cleanWhole = isNeg ? whole.substring(1) : whole;
    return `
      ${isNeg ? '<span class="f-sign">−</span>' : ''}
      <span class="f-whole">${cleanWhole}</span>
      <span class="frac-box">
        <span class="f-num">${num}</span>
        <span class="f-den">${den}</span>
      </span>
    `;
  }

  // کسر ساده: مثلا "3/4" یا "-5/8"
  if (valStr.includes('/') && !valStr.includes(' ')) {
    const [num, den] = valStr.split('/');
    const isNeg = num.startsWith('-');
    const cleanNum = isNeg ? num.substring(1) : num;
    return `
      ${isNeg ? '<span class="f-sign">−</span>' : ''}
      <span class="frac-box">
        <span class="f-num">${cleanNum}</span>
        <span class="f-den">${den}</span>
      </span>
    `;
  }

  return valStr;
}

// تبدیل متن عملگرها برای نمایش فرمول بالا
function renderExpressionHTML(expr) {
  if (!expr) return '';
  return expr
    .replace(/\//g, '⁄')
    .replace(/\*/g, '×');
}

// --- کنترلر ماشین حساب ---
class Calculator {
  constructor(previousOperandEl, currentOperandEl, fractionSubviewEl, formatLabelEl) {
    this.previousOperandEl = previousOperandEl;
    this.currentOperandEl = currentOperandEl;
    this.fractionSubviewEl = fractionSubviewEl;
    this.formatLabelEl = formatLabelEl;
    this.history = [];
    this.displayFormat = 'fraction'; // 'fraction' (پیش‌فرض کسری) | 'mixed' | 'decimal'
    this.lastResultFraction = null;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.lastResultFraction = null;
  }

  delete() {
    if (this.shouldResetScreen) {
      this.clear();
      return;
    }
    if (this.currentOperand === '0') return;
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.lastResultFraction = null;
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
      this.lastResultFraction = null;
    }

    if (number === '.') {
      // فقط در بخش صورت یا مخرج یکبار نقطه مجاز است
      const currentSegment = this.currentOperand.includes('/')
        ? this.currentOperand.split('/')[1]
        : this.currentOperand;
      if (currentSegment.includes('.')) return;
    }

    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      if (this.currentOperand.length >= 16) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    this.lastResultFraction = null;
  }

  appendFraction() {
    if (this.shouldResetScreen) {
      this.shouldResetScreen = false;
    }

    // اگر قبلاً خط کسر گذاشته شده، نگذار دوباره تکرار شود
    if (this.currentOperand.includes('/')) return;

    // حذف نقطه اعشار انتهایی در صورت وجود
    if (this.currentOperand.endsWith('.')) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }

    if (this.currentOperand === '') {
      this.currentOperand = '0/';
    } else {
      this.currentOperand += '/';
    }
    this.lastResultFraction = null;
  }

  chooseOperation(operation) {
    if (this.currentOperand === '' && this.previousOperand === '') return;

    // پاکسازی انتهای عدد در صورت داشتن خط کسر ناتمام
    if (this.currentOperand.endsWith('/')) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }

    if (this.previousOperand !== '') {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = `${this.currentOperand} ${this.operation}`;
    this.shouldResetScreen = true;
  }

  compute() {
    if (this.currentOperand.endsWith('/')) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }

    if (!this.previousOperand || !this.operation) return;

    const prevStr = this.previousOperand.split(' ')[0];
    const currentStr = this.currentOperand;

    let prevFrac, currentFrac, resultFrac;

    try {
      prevFrac = Fraction.parse(prevStr);
      currentFrac = Fraction.parse(currentStr);

      switch (this.operation) {
        case '+':
          resultFrac = prevFrac.add(currentFrac);
          break;
        case '-':
          resultFrac = prevFrac.sub(currentFrac);
          break;
        case '×':
          resultFrac = prevFrac.mul(currentFrac);
          break;
        case '÷':
          if (currentFrac.isZero()) {
            this.handleDivideByZero();
            return;
          }
          resultFrac = prevFrac.div(currentFrac);
          break;
        default:
          return;
      }
    } catch (e) {
      this.handleDivideByZero();
      return;
    }

    this.lastResultFraction = resultFrac;

    // نتیجه همواره کسری ساده است (پیش‌فرض)
    const fractionResultStr = resultFrac.toFractionString();
    const expression = `${this.previousOperand} ${currentStr}`;

    this.addHistory(expression, fractionResultStr, resultFrac);

    // اعمال حالت نمایش فعال
    this.applyDisplayFormat();

    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;

    // انیمیشن و صدای پیروزی
    triggerMascotHappy();
    sounds.playChime();
  }

  percent() {
    try {
      if (this.currentOperand.endsWith('/')) {
        this.currentOperand = this.currentOperand.slice(0, -1);
      }
      const frac = Fraction.parse(this.currentOperand);
      // ضرب در ۱/۱۰۰
      const res = frac.div(new Fraction(100n, 1n));
      this.lastResultFraction = res;
      this.applyDisplayFormat();
    } catch (e) {}
  }

  negate() {
    if (this.currentOperand === '0' || this.currentOperand === '') return;
    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.substring(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
    if (this.lastResultFraction) {
      this.lastResultFraction = this.lastResultFraction.negate();
    }
  }

  toggleDisplayFormat() {
    if (!this.lastResultFraction) {
      // اگر نتیجه‌ای نیست، سعی کن عدد جاری را به کسر تبدیل کنی
      try {
        this.lastResultFraction = Fraction.parse(this.currentOperand);
      } catch (e) {
        return;
      }
    }

    if (this.displayFormat === 'fraction') {
      this.displayFormat = this.lastResultFraction.d !== 1n ? 'mixed' : 'decimal';
    } else if (this.displayFormat === 'mixed') {
      this.displayFormat = 'decimal';
    } else {
      this.displayFormat = 'fraction';
    }

    this.applyDisplayFormat();
    sounds.playPop(580);
  }

  setDisplayFormat(mode) {
    this.displayFormat = mode;
    this.applyDisplayFormat();
  }

  applyDisplayFormat() {
    if (!this.lastResultFraction) return;

    if (this.displayFormat === 'fraction') {
      this.currentOperand = this.lastResultFraction.toFractionString();
      this.formatLabelEl.innerText = 'نما: کسر ساده';
    } else if (this.displayFormat === 'mixed') {
      this.currentOperand = this.lastResultFraction.toMixedString();
      this.formatLabelEl.innerText = 'نما: کسر مخلوط';
    } else if (this.displayFormat === 'decimal') {
      this.currentOperand = this.lastResultFraction.toDecimalString();
      this.formatLabelEl.innerText = 'نما: اعشاری';
    }
  }

  handleDivideByZero() {
    this.currentOperand = 'خطا! (0÷)';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = true;
    this.lastResultFraction = null;
    triggerMascotDizzy();
    sounds.playError();
  }

  addHistory(expression, result, fracObj) {
    this.history.unshift({
      expression,
      result,
      mixed: fracObj ? fracObj.toMixedString() : result,
      decimal: fracObj ? fracObj.toDecimalString() : result
    });
    if (this.history.length > 25) this.history.pop();
    renderHistory();
  }

  updateDisplay() {
    // رندر HTML فرمول کسر
    this.currentOperandEl.innerHTML = renderFractionHTML(this.currentOperand);

    if (this.operation != null) {
      this.previousOperandEl.innerText = renderExpressionHTML(this.previousOperand);
    } else {
      this.previousOperandEl.innerText = renderExpressionHTML(this.previousOperand);
    }

    // به‌روزرسانی زیرنویس هوشمند کسر (نمایش معادل‌ها)
    if (this.lastResultFraction && this.lastResultFraction.d !== 1n) {
      const mixedStr = this.lastResultFraction.toMixedString();
      const decStr = this.lastResultFraction.toDecimalString();
      const fracStr = this.lastResultFraction.toFractionString();

      this.fractionSubviewEl.innerHTML = `
        <span class="subview-pill" id="pillFrac" title="تغییر به کسر ساده">⅟ ${fracStr}</span>
        <span class="subview-pill" id="pillMixed" title="تغییر به کسر مخلوط">🍰 ${mixedStr}</span>
        <span class="subview-pill" id="pillDec" title="تغییر به اعشار">🔢 ${decStr}</span>
      `;
      this.fractionSubviewEl.classList.add('show');

      // اتصال کلیک روی پیل‌ها
      document.getElementById('pillFrac')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setDisplayFormat('fraction');
        this.updateDisplay();
        sounds.playPop(520);
      });
      document.getElementById('pillMixed')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setDisplayFormat('mixed');
        this.updateDisplay();
        sounds.playPop(520);
      });
      document.getElementById('pillDec')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setDisplayFormat('decimal');
        this.updateDisplay();
        sounds.playPop(520);
      });
    } else {
      this.fractionSubviewEl.innerHTML = '';
      this.fractionSubviewEl.classList.remove('show');
    }

    // کوچک‌کردن فونت برای مقادیر خیلی طولانی
    if (this.currentOperand.length > 10) {
      this.currentOperandEl.classList.add('shrink');
    } else {
      this.currentOperandEl.classList.remove('shrink');
    }
  }
}

// --- المان‌های DOM ---
const previousOperandEl = document.getElementById('previousOperand');
const currentOperandEl = document.getElementById('currentOperand');
const fractionSubviewEl = document.getElementById('fractionSubview');
const formatLabelEl = document.getElementById('formatLabel');
const formatToggleBtn = document.getElementById('formatToggleBtn');
const fracBtn = document.getElementById('fracBtn');
const mascotEl = document.getElementById('mascot');
const calcCard = document.getElementById('calcCard');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const historyToggle = document.getElementById('historyToggle');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
const displayContainer = document.getElementById('displayContainer');
const copyBadge = document.getElementById('copyBadge');
const themeButtons = document.querySelectorAll('.theme-btn');

const calculator = new Calculator(
  previousOperandEl,
  currentOperandEl,
  fractionSubviewEl,
  formatLabelEl
);

// --- رفتار کاراکتر عروسکی (Mascot) ---
function triggerMascotBlink() {
  mascotEl.classList.add('blink');
  setTimeout(() => {
    mascotEl.classList.remove('blink');
  }, 200);
}

// چشمک زدن رندوم هر چند ثانیه
setInterval(() => {
  if (Math.random() > 0.4) {
    triggerMascotBlink();
  }
}, 3500);

function triggerMascotHappy() {
  mascotEl.classList.add('happy');
  calcCard.classList.add('celebrate');
  setTimeout(() => {
    mascotEl.classList.remove('happy');
    calcCard.classList.remove('celebrate');
  }, 900);
}

function triggerMascotDizzy() {
  mascotEl.classList.add('dizzy');
  setTimeout(() => {
    mascotEl.classList.remove('dizzy');
  }, 1400);
}

mascotEl.addEventListener('click', () => {
  triggerMascotHappy();
  sounds.playPop(620);
});

// --- مدیریت کلیدهای ماشین حساب ---
document.querySelectorAll('[data-number]').forEach(button => {
  button.addEventListener('click', () => {
    triggerHaptic(12);
    calculator.appendNumber(button.dataset.number);
    calculator.updateDisplay();
    sounds.playPop(440 + Math.random() * 80);
  });
});

document.querySelectorAll('[data-operator]').forEach(button => {
  button.addEventListener('click', () => {
    triggerHaptic(15);
    calculator.chooseOperation(button.dataset.operator);
    calculator.updateDisplay();
    sounds.playPop(560);
  });
});

document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', () => {
    triggerHaptic(15);
    const action = button.dataset.action;
    switch (action) {
      case 'all-clear':
        calculator.clear();
        sounds.playPop(340);
        break;
      case 'delete':
        calculator.delete();
        sounds.playPop(380);
        break;
      case 'fraction':
        calculator.appendFraction();
        sounds.playPop(640);
        break;
      case 'percent':
        calculator.percent();
        sounds.playPop(500);
        break;
      case 'negate':
        calculator.negate();
        sounds.playPop(480);
        break;
      case 'calculate':
        calculator.compute();
        break;
      case 'toggle-format':
        calculator.toggleDisplayFormat();
        break;
    }
    calculator.updateDisplay();
  });
});

// --- کپی کردن نتیجه با کلیک روی نمایشگر ---
displayContainer.addEventListener('click', async (e) => {
  // اگر روی پیل‌های زیرنویس کلیک شده، عمل کپی کلی انجام نشود
  if (e.target.closest('.subview-pill')) return;

  try {
    const textToCopy = calculator.currentOperand;
    if (textToCopy && textToCopy !== 'خطا! (0÷)') {
      await navigator.clipboard.writeText(textToCopy);
      copyBadge.classList.add('show');
      sounds.playPop(650);
      setTimeout(() => {
        copyBadge.classList.remove('show');
      }, 1500);
    }
  } catch (err) {
    console.log('Copy failed', err);
  }
});

// --- تاریخچه (History) ---
function renderHistory() {
  if (calculator.history.length === 0) {
    historyList.innerHTML = '<li class="empty-msg">هنوز محاسبه‌ای انجام نشده ✨</li>';
    return;
  }

  historyList.innerHTML = '';
  calculator.history.forEach(item => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <span class="hist-exp">${renderExpressionHTML(item.expression)} =</span>
      <span class="hist-res">${item.result} ${item.mixed !== item.result ? `(${item.mixed})` : ''}</span>
    `;
    li.addEventListener('click', () => {
      calculator.currentOperand = item.result.toString();
      try {
        calculator.lastResultFraction = Fraction.parse(item.result);
      } catch (e) {
        calculator.lastResultFraction = null;
      }
      calculator.previousOperand = '';
      calculator.operation = undefined;
      calculator.updateDisplay();
      historyPanel.classList.remove('open');
      sounds.playPop(520);
    });
    historyList.appendChild(li);
  });
}

historyToggle.addEventListener('click', () => {
  historyPanel.classList.toggle('open');
  sounds.playPop(400);
});

clearHistoryBtn.addEventListener('click', () => {
  calculator.history = [];
  renderHistory();
  sounds.playPop(300);
});

document.addEventListener('click', (e) => {
  if (!historyPanel.contains(e.target) && !historyToggle.contains(e.target) && historyPanel.classList.contains('open')) {
    historyPanel.classList.remove('open');
  }
});

// --- تغییر استیکرهای پس‌زمینه متناسب با تم ---
const backgroundBubbles = document.querySelectorAll('.bubble');
const themeEmojis = {
  pink: ['🌸', '✨', '💖', '⭐', '☁️', '🍬'],
  purple: ['🌌', '✨', '🔮', '⭐', '🪐', '💜'],
  mint: ['🍀', '✨', '🍃', '⭐', '🌱', '🍏'],
  sunset: ['🍊', '✨', '🌅', '⭐', '🍯', '🍑'],
  cyber: ['🎮', '⚡', '🚀', '👾', '🤖', '🏎️'],
  hero: ['🚀', '⚽', '🏎️', '⚡', '🛹', '🏆']
};

function updateThemeBubbles(theme) {
  const emojis = themeEmojis[theme] || themeEmojis.pink;
  backgroundBubbles.forEach((bubble, index) => {
    if (emojis[index]) {
      bubble.innerText = emojis[index];
    }
  });
}

// --- لرزش ویبره لمسی برای گوشی‌های اندروید (Haptic Feedback) ---
function triggerHaptic(duration = 15) {
  if (navigator && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(duration);
    } catch (e) {}
  }
}

// --- رنگ نوار وضعیت اندروید متناسب با تم ---
const metaThemeColors = {
  pink: '#ff85a2',
  purple: '#a78bfa',
  mint: '#34d399',
  sunset: '#fb923c',
  cyber: '#090d16',
  hero: '#0f172a'
};
const metaThemeColorEl = document.getElementById('metaThemeColor');

// --- تنظیمات تم و ذخیره در LocalStorage ---
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  themeButtons.forEach(b => {
    b.classList.toggle('active', b.dataset.setTheme === theme);
  });
  updateThemeBubbles(theme);

  // هماهنگ‌سازی رنگ استاتوس‌بار اندروید
  if (metaThemeColorEl && metaThemeColors[theme]) {
    metaThemeColorEl.setAttribute('content', metaThemeColors[theme]);
  }

  try {
    localStorage.setItem('fancalc_theme', theme);
  } catch (e) {}
}

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.setTheme;
    setTheme(theme);
    sounds.playPop(theme === 'cyber' ? 700 : 600);
  });
});

try {
  const savedTheme = localStorage.getItem('fancalc_theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    updateThemeBubbles('pink');
  }
} catch (e) {
  updateThemeBubbles('pink');
}

// --- فعال/غیرفعال‌سازی صدا ---
soundToggle.addEventListener('click', () => {
  sounds.enabled = !sounds.enabled;
  soundIcon.innerText = sounds.enabled ? '🔔' : '🔕';
  try {
    localStorage.setItem('fancalc_sound', sounds.enabled ? '1' : '0');
  } catch (e) {}
  if (sounds.enabled) sounds.playPop(500);
});

try {
  const savedSound = localStorage.getItem('fancalc_sound');
  if (savedSound === '0') {
    sounds.enabled = false;
    soundIcon.innerText = '🔕';
  }
} catch (e) {}

// --- پشتیبانی کامل از صفحه‌کلید (Keyboard Support) ---
window.addEventListener('keydown', (e) => {
  let key = e.key;

  // کلیدهای عددی
  if ((key >= '0' && key <= '9') || key === '.') {
    pressVisualButton(`[data-number="${key}"]`);
    calculator.appendNumber(key);
    calculator.updateDisplay();
    sounds.playPop(440 + Math.random() * 80);
    return;
  }

  // کلید کسر (F یا \)
  if (key === 'f' || key === 'F' || key === '\\' || key === '|') {
    e.preventDefault();
    pressVisualButton('[data-action="fraction"]');
    calculator.appendFraction();
    calculator.updateDisplay();
    sounds.playPop(640);
    return;
  }

  // عملگرها
  if (key === '+') {
    pressVisualButton('[data-operator="+"]');
    calculator.chooseOperation('+');
    calculator.updateDisplay();
    sounds.playPop(560);
    return;
  }
  if (key === '-') {
    pressVisualButton('[data-operator="-"]');
    calculator.chooseOperation('-');
    calculator.updateDisplay();
    sounds.playPop(560);
    return;
  }
  if (key === '*' || key === 'x' || key === 'X') {
    pressVisualButton('[data-operator="×"]');
    calculator.chooseOperation('×');
    calculator.updateDisplay();
    sounds.playPop(560);
    return;
  }
  if (key === '/') {
    e.preventDefault();
    pressVisualButton('[data-operator="÷"]');
    calculator.chooseOperation('÷');
    calculator.updateDisplay();
    sounds.playPop(560);
    return;
  }
  if (key === '%') {
    pressVisualButton('[data-action="percent"]');
    calculator.percent();
    calculator.updateDisplay();
    sounds.playPop(500);
    return;
  }

  // مساوی یا اینتر
  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    pressVisualButton('[data-action="calculate"]');
    calculator.compute();
    calculator.updateDisplay();
    return;
  }

  // پاک کردن و بک‌اسپیس
  if (key === 'Backspace') {
    pressVisualButton('[data-action="delete"]');
    calculator.delete();
    calculator.updateDisplay();
    sounds.playPop(380);
    return;
  }

  if (key === 'Escape') {
    pressVisualButton('[data-action="all-clear"]');
    calculator.clear();
    calculator.updateDisplay();
    sounds.playPop(340);
    return;
  }
});

function pressVisualButton(selector) {
  const btn = document.querySelector(selector);
  if (btn) {
    btn.classList.add('pressed');
    setTimeout(() => {
      btn.classList.remove('pressed');
    }, 120);
  }
}

// مقداردهی اولیه نمایشگر
calculator.updateDisplay();

// ==========================================
// 📲 پشتیبانی از PWA و نصب روی گوشی اندروید
// ==========================================

// ثبت Service Worker برای قابلیت کارکرد کاملاً آفلاین
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('PWA ServiceWorker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.log('ServiceWorker registration error:', err);
      });
  });
}

// مدیریت اعلان و دکمه نصب اپلیکیشن روی گوشی (Install Prompt)
let deferredInstallPrompt = null;
const pwaInstallBtn = document.getElementById('pwaInstallBtn');
const pwaBanner = document.getElementById('pwaBanner');
const pwaBannerBtn = document.getElementById('pwaBannerBtn');
const pwaBannerClose = document.getElementById('pwaBannerClose');

window.addEventListener('beforeinstallprompt', (e) => {
  // جلوگیری از نمایش بنر پیش‌فرض مرورگر
  e.preventDefault();
  deferredInstallPrompt = e;

  // نمایش دکمه نصب زیبا در نوار بالای ماشین حساب و بنر پایین
  if (pwaInstallBtn) pwaInstallBtn.style.display = 'flex';
  if (pwaBanner) pwaBanner.style.display = 'flex';
});

async function handlePwaInstall() {
  if (!deferredInstallPrompt) return;
  triggerHaptic(20);

  // نمایش برگه نصب اندروید
  deferredInstallPrompt.prompt();
  const choiceResult = await deferredInstallPrompt.userChoice;

  if (choiceResult.outcome === 'accepted') {
    console.log('User installed the PWA app');
    if (pwaInstallBtn) pwaInstallBtn.style.display = 'none';
    if (pwaBanner) pwaBanner.style.display = 'none';
  }
  deferredInstallPrompt = null;
}

if (pwaInstallBtn) {
  pwaInstallBtn.addEventListener('click', handlePwaInstall);
}

if (pwaBannerBtn) {
  pwaBannerBtn.addEventListener('click', handlePwaInstall);
}

if (pwaBannerClose) {
  pwaBannerClose.addEventListener('click', () => {
    triggerHaptic(10);
    if (pwaBanner) pwaBanner.style.display = 'none';
  });
}

// وقتی برنامه قبلاً نصب شد یا نصب به اتمام رسید
window.addEventListener('appinstalled', () => {
  console.log('PWA application installed successfully!');
  if (pwaInstallBtn) pwaInstallBtn.style.display = 'none';
  if (pwaBanner) pwaBanner.style.display = 'none';
  deferredInstallPrompt = null;
});
