# Generated by Django 3.1.6 on 2021-02-10 11:02

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('restapi', '0004_auto_20210210_1150'),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.AlterField(
            model_name='light',
            name='brightness',
            field=models.PositiveSmallIntegerField(blank=True, default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)]),
        ),
        migrations.AlterField(
            model_name='light',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restapi.room'),
        ),
        migrations.AlterField(
            model_name='thermostat',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='restapi.room'),
        ),
    ]
