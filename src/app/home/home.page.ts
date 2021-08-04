import { Component } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //array que guarda as tarefas
  tasks: any[] = [];

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private loadingCtrl: LoadingController) {
    //ir buscar as task's no local storage
    let taskJson = localStorage.getItem('taskDb');

    //validação se existir algo no localStorage
    if (taskJson != null) {
      //se existir, inserimos tudo o que está na localstorage no array. Usa-se o json.parse para q se assimile um array de strings 
      this.tasks = JSON.parse(taskJson);
    }
  }

  //abre a opção para adicionar uma nova tarefa
  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que pretende fazer?',
      inputs: [
        {
          name: 'newTask',
          type: 'text',
          placeholder: 'Insira a tarefa..'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            this.add(form.newTask);
          }
        }
      ]
    });

    await alert.present();
  }

  //Adicionar nova tarefa à tela
  async add(newTask: string) {
    //validação se o utilizador preencheu o form
    if (newTask.trim().length < 1) {
      const toastinsert = await this.toastCtrl.create({
        message: 'Informe o que pretende fazer!',
        duration: 2000,
        position: 'top',
        color: 'warning',
        mode: 'ios'
      });

      toastinsert.present();
    } else {

      let task = { name: newTask, done: false }
      //leva a variável e cima para o array de tarefas
      this.tasks.push(task);

      this.updateLocalStorage()


      const toast = await this.toastCtrl.create({
        message: 'Inseriu a tarefa com sucesso!',
        duration: 2000,
        position: 'middle',
        color: 'success',
        cssClass: 'animate__animated animate__heartBeat',
        mode: 'ios'
      })

      toast.present();
    }
  }

  //Função que guarda o array de tarefas no armazenamento da app/browser
  updateLocalStorage() {
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }

  //abre as opções referente a cada tarefa
  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O que pretende fazer?',
      buttons: [{
        //dependendo do valor da task.done ele altera o texto e o icon a mostrar para o utilizador
        text: task.done ? 'Desfazer tarefa' : 'Marcar tarefa como concluida',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          //trocar o valor da task.done
          task.done = !task.done;

          //dar update ao localStorage
          this.updateLocalStorage();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async delete(task: any) {

    const toast = await this.toastCtrl.create({
      message: 'Eliminou a tarefa com sucesso!',
      duration: 2000,
      position: 'middle',
      color: 'danger',
      cssClass: 'animate__animated animate__heartBeat',
      mode: 'ios'
    });

    const alert = await this.alertCtrl.create({
      cssClass: 'warning',
      header: 'Atenção!',
      message: 'Tem a certeza que deseja eliminar esta tarefa?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            //vai filtrar todos os que sejam diferentes da task que é para eliminar
            this.tasks = this.tasks.filter(taskArray => task != taskArray);

            //dar update ao localStorage
            this.updateLocalStorage();
            toast.present();
          }
        }
      ]
    });

    await alert.present();

  }

}

