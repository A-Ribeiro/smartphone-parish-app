namespace editor_informacao_paroquia
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.listBox1 = new System.Windows.Forms.ListBox();
            this.tb_content = new System.Windows.Forms.TextBox();
            this.bt_salvar = new System.Windows.Forms.Button();
            this.bt_nova = new System.Windows.Forms.Button();
            this.tb_titulo = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.checkBox1 = new System.Windows.Forms.CheckBox();
            this.bt_cima = new System.Windows.Forms.Button();
            this.bt_baixo = new System.Windows.Forms.Button();
            this.bt_remove = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // listBox1
            // 
            this.listBox1.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.listBox1.FormattingEnabled = true;
            this.listBox1.HorizontalScrollbar = true;
            this.listBox1.Location = new System.Drawing.Point(12, 49);
            this.listBox1.Name = "listBox1";
            this.listBox1.Size = new System.Drawing.Size(185, 264);
            this.listBox1.TabIndex = 0;
            this.listBox1.SelectedIndexChanged += new System.EventHandler(this.listBox1_SelectedIndexChanged);
            // 
            // tb_content
            // 
            this.tb_content.AcceptsTab = true;
            this.tb_content.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tb_content.Font = new System.Drawing.Font("Courier New", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tb_content.Location = new System.Drawing.Point(203, 85);
            this.tb_content.Multiline = true;
            this.tb_content.Name = "tb_content";
            this.tb_content.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.tb_content.Size = new System.Drawing.Size(494, 230);
            this.tb_content.TabIndex = 1;
            this.tb_content.WordWrap = false;
            // 
            // bt_salvar
            // 
            this.bt_salvar.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.bt_salvar.Location = new System.Drawing.Point(557, 12);
            this.bt_salvar.Name = "bt_salvar";
            this.bt_salvar.Size = new System.Drawing.Size(75, 23);
            this.bt_salvar.TabIndex = 2;
            this.bt_salvar.Text = "salvar";
            this.bt_salvar.UseVisualStyleBackColor = true;
            this.bt_salvar.Click += new System.EventHandler(this.bt_salvar_Click);
            // 
            // bt_nova
            // 
            this.bt_nova.Location = new System.Drawing.Point(12, 12);
            this.bt_nova.Name = "bt_nova";
            this.bt_nova.Size = new System.Drawing.Size(75, 23);
            this.bt_nova.TabIndex = 3;
            this.bt_nova.Text = "nova";
            this.bt_nova.UseVisualStyleBackColor = true;
            this.bt_nova.Click += new System.EventHandler(this.bt_nova_Click);
            // 
            // tb_titulo
            // 
            this.tb_titulo.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.tb_titulo.Location = new System.Drawing.Point(203, 59);
            this.tb_titulo.Name = "tb_titulo";
            this.tb_titulo.Size = new System.Drawing.Size(419, 20);
            this.tb_titulo.TabIndex = 4;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(203, 43);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(35, 13);
            this.label1.TabIndex = 5;
            this.label1.Text = "Título";
            // 
            // checkBox1
            // 
            this.checkBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.checkBox1.AutoSize = true;
            this.checkBox1.Checked = true;
            this.checkBox1.CheckState = System.Windows.Forms.CheckState.Checked;
            this.checkBox1.Location = new System.Drawing.Point(628, 60);
            this.checkBox1.Name = "checkBox1";
            this.checkBox1.Size = new System.Drawing.Size(69, 17);
            this.checkBox1.TabIndex = 6;
            this.checkBox1.Text = "embutido";
            this.checkBox1.UseVisualStyleBackColor = true;
            // 
            // bt_cima
            // 
            this.bt_cima.Location = new System.Drawing.Point(219, 12);
            this.bt_cima.Name = "bt_cima";
            this.bt_cima.Size = new System.Drawing.Size(75, 23);
            this.bt_cima.TabIndex = 7;
            this.bt_cima.Text = "^ cima";
            this.bt_cima.UseVisualStyleBackColor = true;
            this.bt_cima.Click += new System.EventHandler(this.bt_cima_Click);
            // 
            // bt_baixo
            // 
            this.bt_baixo.Location = new System.Drawing.Point(138, 12);
            this.bt_baixo.Name = "bt_baixo";
            this.bt_baixo.Size = new System.Drawing.Size(75, 23);
            this.bt_baixo.TabIndex = 8;
            this.bt_baixo.Text = "v baixo";
            this.bt_baixo.UseVisualStyleBackColor = true;
            this.bt_baixo.Click += new System.EventHandler(this.bt_baixo_Click);
            // 
            // bt_remove
            // 
            this.bt_remove.Location = new System.Drawing.Point(300, 12);
            this.bt_remove.Name = "bt_remove";
            this.bt_remove.Size = new System.Drawing.Size(75, 23);
            this.bt_remove.TabIndex = 9;
            this.bt_remove.Text = "remover";
            this.bt_remove.UseVisualStyleBackColor = true;
            this.bt_remove.Click += new System.EventHandler(this.bt_remove_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(713, 325);
            this.Controls.Add(this.bt_remove);
            this.Controls.Add(this.bt_baixo);
            this.Controls.Add(this.bt_cima);
            this.Controls.Add(this.checkBox1);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.tb_titulo);
            this.Controls.Add(this.bt_nova);
            this.Controls.Add(this.bt_salvar);
            this.Controls.Add(this.tb_content);
            this.Controls.Add(this.listBox1);
            this.Name = "Form1";
            this.Text = "Informações Paróquia";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox listBox1;
        private System.Windows.Forms.TextBox tb_content;
        private System.Windows.Forms.Button bt_salvar;
        private System.Windows.Forms.Button bt_nova;
        private System.Windows.Forms.TextBox tb_titulo;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.CheckBox checkBox1;
        private System.Windows.Forms.Button bt_cima;
        private System.Windows.Forms.Button bt_baixo;
        private System.Windows.Forms.Button bt_remove;
    }
}

