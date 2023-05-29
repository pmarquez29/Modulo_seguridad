import { Component } from '@angular/core';

interface Question {
  question: string;
  isThreat: boolean;
  options: string[];
  subOptions: string[][];
  selectedOptions: (string | null)[];
}

@Component({
  selector: 'app-root',
  template: `
    <h2>CLASIFICACION DE INFORMACION</h2>
    <div *ngIf="question">
      <h3>Amenaza o vulnerabilidad</h3>
      <p>{{ question }}</p>
      <form>
        <div *ngFor="let option of options; let i = index">
          <input type="radio" name="answer" [value]="option" [(ngModel)]="selectedOptions[i]" (change)="selectOption()">
          <label>{{ option }}</label>
        </div>
        <div *ngIf="showSubOptions">
          <h3>{{ subQuestion }}</h3>
          <div *ngFor="let subOption of subOptions; let i = index">
            <input type="radio" name="subAnswer" [value]="subOption" [(ngModel)]="selectedSubOption">
            <label>{{ subOption }}</label>
          </div>
        </div>
        <button type="button" (click)="submitAnswer()" [disabled]="!selectedOptions[0] || (!selectedSubOption && showSubOptions)">Enviar</button>
      </form>
    </div>
    <div *ngIf="score !== undefined">
      <h3>Resultados:</h3>
      <p>Puntaje: {{ score }}</p>
      <button (click)="startQuiz()">Iniciar nuevamente</button>
    </div>
  `
})
export class AppComponent {
  title: string = 'Mi Aplicación';
  threatsAndVulnerabilities: string[] = [
    'Epidemia',
    'Terremotos, Sismos',
    'Alteración de registros',
    'Desconocimiento de controles implementados',
    'Incendio',
    'Falta de monitoreo en los límites de producción y stock',
    'Destrucción de activos de información',
    'Diseño inadecuado del proceso de reclutamiento de personal',
    'Inundación',
    'Fraude interno',
    'Empleado sin ética',
    'Deslizamientos',
    'Obsolescencia de servidores',
    'Infraestructura con cañerías de agua y cableado eléctrico sin separación en entretecho',
    'Lluvias torrenciales y granizos',
    'Incumplimiento de políticas de seguridad de información',
    'Falsificación de documentos'
  ];

  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  question: string = '';
  options: string[] = [];
  selectedOptions: (string | null)[] = [];
  subQuestion: string | undefined = undefined;
  subOptions: string[] = [];
  selectedSubOption: string | null = null;
  score: number | undefined = undefined;
  showSubOptions: boolean = false;

  constructor() {
    this.generateQuestions();
    this.startQuiz();
  }

  generateQuestions() {
    const shuffledThreats = this.shuffleArray(this.threatsAndVulnerabilities.slice());
    const duplicatedQuestions: Question[] = [];

    shuffledThreats.forEach((threat) => {
      const isThreat = Math.random() < 0.5;
      const VulnerabilitiesOptions = ['Personas', 'Procesos', 'Tecnología', 'Infraestructura'];
      const ThreatOptions = ['Natural', 'Causada por el hombre'];

      const question: Question = {
        question: threat,
        isThreat: isThreat,
        options: ['Amenaza' , 'Vulnerabilidad'],
        subOptions: [ThreatOptions , VulnerabilitiesOptions],
        selectedOptions: [null, null]
      };

      duplicatedQuestions.push(question);
    });

    this.questions = duplicatedQuestions;
  }

  shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  startQuiz() {
    this.currentQuestionIndex = 0;
    this.score = undefined;
    this.showNextQuestion();
  }

  showNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const questionData = this.questions[this.currentQuestionIndex];
      this.question = questionData.question;
      this.options = questionData.options;
      this.selectedOptions = new Array(this.options.length).fill(null);
  
      if (questionData.isThreat) {
        this.subQuestion = '¿Es esta una amenaza natural o causada por el hombre?';
        this.subOptions = questionData.subOptions[0];
      } else {
        this.subQuestion = '¿Cuál es la categoría de vulnerabilidad?';
        this.subOptions = questionData.subOptions[1];
      }
  
      // Conservar el valor de selectedSubOption si ya se ha seleccionado una subopción previamente
      if (this.selectedSubOption !== null && this.subOptions.includes(this.selectedSubOption)) {
        this.showSubOptions = true;
      } else {
        this.selectedSubOption = null;
        this.showSubOptions = false;
      }
    } else {
      this.finishQuiz();
    }
  }
  
  selectOption() {
    const selectedOption = this.selectedOptions[this.currentQuestionIndex];
  
    if (selectedOption === 'Amenaza' || selectedOption === 'Vulnerabilidad') {
      this.subQuestion = (selectedOption === 'Amenaza') ? '¿Es esta una amenaza natural o causada por el hombre?' : '¿Cuál es la categoría de vulnerabilidad?';
      this.subOptions = this.questions[this.currentQuestionIndex].subOptions[(selectedOption === 'Amenaza') ? 0 : 1];
      this.selectedSubOption = null;
      this.showSubOptions = true;
    } else {
      this.subQuestion = undefined;
      this.subOptions = [];
      this.selectedSubOption = null;
      this.showSubOptions = false;
    }
  }
  submitAnswer() {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    currentQuestion.selectedOptions[0] = this.selectedOptions[0];
    currentQuestion.selectedOptions[1] = this.selectedSubOption;

    this.currentQuestionIndex++;
    this.showNextQuestion();
  }

  finishQuiz() {
    // Lógica adicional al finalizar el quiz, si es necesario
  }
}
