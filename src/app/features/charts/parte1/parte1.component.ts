import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-parte1',
  templateUrl: './parte1.component.html',
  styleUrls: ['./parte1.component.scss']
})
export class Parte1Component implements OnInit {

  public t_values: number[] = [];
  public t_values_sierra: number[] = [];
  public t_values_rectificador: number[] = [];
  public ondaCuadradaValues: number[] = [];
  public dienteSierraValues: number[] = [];
  public rectificadorValues: number[] = [];
  public fourierOndaCuadradaValues: number[] = [];
  public fourierDienteSierraValues: number[] = [];
  public fourierRectificadorValues: number[] = [];
  public ondaCuadradaChart: any;
  public dienteSierraChart: any;
  public rectificadorChart: any;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createGraphs();
  }

  // Extensión periódica de una función definida en [a, b]
  extensionPeriodica(a: number, b: number): (f: (x: number) => number) => (x: number) => number {
    const T = b - a;
    return (f: (x: number) => number) => {
      return (x: number): number => {
        const x_mod = ((x - a) % T + T) % T + a;
        return f(x_mod);  // Mapeamos x dentro del intervalo [a, b]
      };
    };
  }

  // Función que define la onda cuadrada
  ondaCuadrada(t: number): number {
    if (t >= -(1 / 4) && t <= (1 / 4)) {
      return 1;  // La onda cuadrada es 1 entre [-1/4, 1/4]
    }
    return -1;  // Fuera de ese intervalo, es -1
  }

  // Función "Diente de Sierra" periódica en [-1, 1]
  dienteSierra(t: number): number {
    return t;  // El diente de sierra es lineal en [-1, 1]
  }

  // Función "Rectificador" periódica en [-π, π]
  rectificador(t: number): number {
    return Math.abs(Math.sin(t));  // Usamos el valor absoluto de la función seno en [-π, π]
  }

  // Suma parcial de Fourier de una función con N términos
  fourierSumaParcial(f: (t: number) => number, L: number, N: number): (t: number) => number {
    const a0 = this.fourierA0(f, L);  // Valor de a0 correctamente calculado
    return (t: number) => {
      let sum = a0 / 2;  // Agregamos el término constante a0 / 2
      for (let n = 1; n <= N; n++) {
        const wn = (n * Math.PI) / L;  // Frecuencia angular
        const an = this.fourierAn(f, L, n);  // Coeficiente an
        const bn = this.fourierBn(f, L, n);  // Coeficiente bn
        sum += an * Math.cos(wn * t) + bn * Math.sin(wn * t);  // Suma de Fourier
      }
      return sum;  // Devuelve la suma parcial de Fourier
    };
  }

  // Coeficiente a0 de Fourier (corregido para la normalización)
  fourierA0(f: (t: number) => number, L: number): number {
    const nIntervals = 1000;  // Número de intervalos para la integral numérica
    const step = (2 * L) / nIntervals;  // Tamaño del paso
    let sum = 0;
    for (let i = 0; i <= nIntervals; i++) {
      const t = -L + i * step;
      sum += f(t);  // Suma de la función en cada intervalo
    }
    return (sum * step) / (2 * L);  // Normalización del coeficiente a0
  }

  // Coeficiente an de Fourier
  fourierAn(f: (t: number) => number, L: number, n: number): number {
    const wn = (n * Math.PI) / L;
    const nIntervals = 1000;
    const step = (2 * L) / nIntervals;
    let sum = 0;
    for (let i = 0; i <= nIntervals; i++) {
      const t = -L + i * step;
      sum += f(t) * Math.cos(wn * t);  // Suma ponderada por coseno
    }
    return (sum * step) / L;  // Normalización del coeficiente an
  }

  // Coeficiente bn de Fourier
  fourierBn(f: (t: number) => number, L: number, n: number): number {
    const wn = (n * Math.PI) / L;
    const nIntervals = 1000;
    const step = (2 * L) / nIntervals;
    let sum = 0;
    for (let i = 0; i <= nIntervals; i++) {
      const t = -L + i * step;
      sum += f(t) * Math.sin(wn * t);  // Suma ponderada por seno
    }
    return (sum * step) / L;  // Normalización del coeficiente bn
  }

  // Crear gráficos con los coeficientes ajustados
  createGraphs(): void {
    const L_onda = 0.5;
    const L_diente = 1;
    const L_rectificador = Math.PI;  // Intervalo corregido [-π, π]
    const N = 100;  // Número de términos de Fourier

    const extendedOndaCuadrada = this.extensionPeriodica(-L_onda, L_onda)(this.ondaCuadrada);
    const extendedDienteSierra = this.extensionPeriodica(-L_diente, L_diente)(this.dienteSierra);
    const extendedRectificador = this.extensionPeriodica(-L_rectificador, L_rectificador)(this.rectificador);

    // Generar valores de t entre [-1, 1]
    this.t_values = Array.from({ length: 1000 }, (_, i) => -1 + i * (2 / 1000));
    this.t_values_sierra = Array.from({ length: 1000 }, (_, i) => -2 + i * (4 / 1000));
    this.t_values_rectificador = Array.from({ length: 1000 }, (_, i) => -Math.PI + i * (2 * Math.PI / 1000));

    // Calcular los valores de cada función periódica
    this.ondaCuadradaValues = this.t_values.map(t => extendedOndaCuadrada(t));
    this.dienteSierraValues = this.t_values_sierra.map(t => extendedDienteSierra(t));
    this.rectificadorValues = this.t_values_rectificador.map(t => extendedRectificador(t));

    // Calcular las sumas parciales de Fourier
    const fourierOndaCuadrada = this.fourierSumaParcial(extendedOndaCuadrada, L_onda, N);
    const fourierDienteSierra = this.fourierSumaParcial(extendedDienteSierra, L_diente, N);
    const fourierRectificador = this.fourierSumaParcial(extendedRectificador, L_rectificador, N);

    this.fourierOndaCuadradaValues = this.t_values.map(t => fourierOndaCuadrada(t));
    this.fourierDienteSierraValues = this.t_values_sierra.map(t => fourierDienteSierra(t));
    this.fourierRectificadorValues = this.t_values_rectificador.map(t => fourierRectificador(t));

    // Crear gráfico de la Onda Cuadrada
    const ctxOndaCuadrada = document.getElementById('ondaCuadradaCanvas') as HTMLCanvasElement;
    this.ondaCuadradaChart = new Chart(ctxOndaCuadrada, {
      type: 'line',
      data: {
        labels: this.t_values,
        datasets: [
          {
            label: 'Onda Cuadrada Periódica',
            data: this.ondaCuadradaValues,
            borderColor: 'blue',
            fill: false,
          },
          {
            label: `Aproximación de Fourier (N=${N})`,
            data: this.fourierOndaCuadradaValues,
            borderColor: 'red',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { type: 'linear', position: 'bottom' },
          y: { type: 'linear' },
        },
      },
    });

    // Crear gráfico del Diente de Sierra
    const ctxDienteSierra = document.getElementById('dienteSierraCanvas') as HTMLCanvasElement;
    this.dienteSierraChart = new Chart(ctxDienteSierra, {
      type: 'line',
      data: {
        labels: this.t_values_sierra,
        datasets: [
          {
            label: 'Diente de Sierra Periódica',
            data: this.dienteSierraValues,
            borderColor: 'green',
            fill: false,
          },
          {
            label: `Aproximación de Fourier (N=${N})`,
            data: this.fourierDienteSierraValues,
            borderColor: 'red',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { type: 'linear', position: 'bottom' },
          y: { type: 'linear' },
        },
      },
    });

    // Crear gráfico del Rectificador
    const ctxRectificador = document.getElementById('rectificadorCanvas') as HTMLCanvasElement;
    this.rectificadorChart = new Chart(ctxRectificador, {
      type: 'line',
      data: {
        labels: this.t_values_rectificador,
        datasets: [
          {
            label: 'Rectificador Periódico',
            data: this.rectificadorValues,
            borderColor: 'orange',
            fill: false,
          },
          {
            label: `Aproximación de Fourier (N=${N})`,
            data: this.fourierRectificadorValues,
            borderColor: 'red',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { type: 'linear', position: 'bottom' },
          y: { type: 'linear' },
        },
      },
    });
  }
}
